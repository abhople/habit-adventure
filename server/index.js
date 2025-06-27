const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Database setup
const db = new sqlite3.Database('./habit_adventure.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    character_name TEXT DEFAULT 'Adventurer',
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Habits table
  db.run(`CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    difficulty TEXT DEFAULT 'easy',
    experience_reward INTEGER DEFAULT 10,
    gold_reward INTEGER DEFAULT 5,
    streak INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Habit completions table
  db.run(`CREATE TABLE IF NOT EXISTS habit_completions (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    experience_gained INTEGER DEFAULT 0,
    gold_gained INTEGER DEFAULT 0,
    FOREIGN KEY (habit_id) REFERENCES habits (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Character equipment table
  db.run(`CREATE TABLE IF NOT EXISTS character_equipment (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_type TEXT NOT NULL,
    rarity TEXT DEFAULT 'common',
    equipped BOOLEAN DEFAULT 0,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Achievements table
  db.run(`CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register user
app.post('/api/register', async (req, res) => {
  const { username, password, character_name } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    db.run(
      'INSERT INTO users (id, username, password, character_name) VALUES (?, ?, ?, ?)',
      [userId, username, hashedPassword, character_name || 'Adventurer'],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        const token = jwt.sign({ id: userId, username }, JWT_SECRET);
        res.json({ token, user: { id: userId, username, character_name: character_name || 'Adventurer' } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        character_name: user.character_name,
        level: user.level,
        experience: user.experience,
        gold: user.gold
      } 
    });
  });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, username, character_name, level, experience, gold FROM users WHERE id = ?', 
    [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(user);
  });
});

// Create habit
app.post('/api/habits', authenticateToken, (req, res) => {
  const { name, description, category, difficulty } = req.body;
  const habitId = uuidv4();
  
  let experienceReward = 10;
  let goldReward = 5;
  
  if (difficulty === 'medium') {
    experienceReward = 20;
    goldReward = 10;
  } else if (difficulty === 'hard') {
    experienceReward = 35;
    goldReward = 20;
  }

  db.run(
    'INSERT INTO habits (id, user_id, name, description, category, difficulty, experience_reward, gold_reward) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [habitId, req.user.id, name, description, category, difficulty, experienceReward, goldReward],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ 
        id: habitId, 
        name, 
        description, 
        category, 
        difficulty, 
        experience_reward: experienceReward,
        gold_reward: goldReward,
        streak: 0 
      });
    }
  );
});

// Get user habits
app.get('/api/habits', authenticateToken, (req, res) => {
  db.all('SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC', 
    [req.user.id], (err, habits) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(habits);
  });
});

// Complete habit
app.post('/api/habits/:id/complete', authenticateToken, (req, res) => {
  const { id } = req.params;
  const completionId = uuidv4();
  
  db.get('SELECT * FROM habits WHERE id = ? AND user_id = ?', [id, req.user.id], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if already completed today
    const today = new Date().toISOString().split('T')[0];
    db.get(
      'SELECT * FROM habit_completions WHERE habit_id = ? AND DATE(completed_at) = ?',
      [id, today],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existing) {
          return res.status(400).json({ error: 'Habit already completed today' });
        }

        // Record completion
        db.run(
          'INSERT INTO habit_completions (id, habit_id, user_id, experience_gained, gold_gained) VALUES (?, ?, ?, ?, ?)',
          [completionId, id, req.user.id, habit.experience_reward, habit.gold_reward],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            // Update habit streak
            const newStreak = habit.streak + 1;
            db.run('UPDATE habits SET streak = ? WHERE id = ?', [newStreak, id]);

            // Update user experience and gold
            db.run(
              'UPDATE users SET experience = experience + ?, gold = gold + ? WHERE id = ?',
              [habit.experience_reward, habit.gold_reward, req.user.id]
            );

            // Check for level up
            db.get('SELECT level, experience FROM users WHERE id = ?', [req.user.id], (err, user) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              const newLevel = Math.floor(user.experience / 100) + 1;
              if (newLevel > user.level) {
                db.run('UPDATE users SET level = ? WHERE id = ?', [newLevel, req.user.id]);
                
                // Unlock equipment based on level
                const equipmentRewards = getEquipmentRewards(newLevel);
                equipmentRewards.forEach(item => {
                  const equipmentId = uuidv4();
                  db.run(
                    'INSERT INTO character_equipment (id, user_id, item_name, item_type, rarity) VALUES (?, ?, ?, ?, ?)',
                    [equipmentId, req.user.id, item.name, item.type, item.rarity]
                  );
                });
              }

              res.json({ 
                success: true, 
                experience_gained: habit.experience_reward,
                gold_gained: habit.gold_reward,
                new_streak: newStreak,
                level_up: newLevel > user.level,
                new_level: newLevel > user.level ? newLevel : user.level,
                equipment_unlocked: newLevel > user.level ? equipmentRewards : []
              });
            });
          }
        );
      }
    );
  });
});

// Get character equipment
app.get('/api/equipment', authenticateToken, (req, res) => {
  db.all('SELECT * FROM character_equipment WHERE user_id = ? ORDER BY unlocked_at DESC', 
    [req.user.id], (err, equipment) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(equipment);
  });
});

// Get achievements
app.get('/api/achievements', authenticateToken, (req, res) => {
  db.all('SELECT * FROM achievements WHERE user_id = ? ORDER BY unlocked_at DESC', 
    [req.user.id], (err, achievements) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(achievements);
  });
});

// Get habit statistics
app.get('/api/stats', authenticateToken, (req, res) => {
  db.get(
    `SELECT 
      COUNT(DISTINCT h.id) as total_habits,
      COUNT(hc.id) as total_completions,
      SUM(hc.experience_gained) as total_experience,
      SUM(hc.gold_gained) as total_gold
    FROM habits h 
    LEFT JOIN habit_completions hc ON h.id = hc.habit_id 
    WHERE h.user_id = ?`,
    [req.user.id],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(stats);
    }
  );
});

// Helper function to get equipment rewards based on level
function getEquipmentRewards(level) {
  const rewards = [];
  
  if (level === 2) {
    rewards.push({ name: 'Wooden Sword', type: 'weapon', rarity: 'common' });
  } else if (level === 3) {
    rewards.push({ name: 'Leather Armor', type: 'armor', rarity: 'common' });
  } else if (level === 5) {
    rewards.push({ name: 'Iron Sword', type: 'weapon', rarity: 'uncommon' });
  } else if (level === 7) {
    rewards.push({ name: 'Magic Staff', type: 'weapon', rarity: 'rare' });
  } else if (level === 10) {
    rewards.push({ name: 'Dragon Scale Armor', type: 'armor', rarity: 'epic' });
  }
  
  return rewards;
}

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Habit Adventure server running on port ${PORT}`);
  console.log(`🎮 Ready for epic habit tracking adventures!`);
}); 