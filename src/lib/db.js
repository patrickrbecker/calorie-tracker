import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NO_SSL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS calories (
        id SERIAL PRIMARY KEY,
        participant_name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        calories INTEGER NOT NULL,
        week_number INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (participant_name) REFERENCES participants(name),
        UNIQUE(participant_name, date)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Initialize current week to 1 if it doesn't exist
    await pool.query(`
      INSERT INTO settings (key, value) VALUES ('current_week', '1')
      ON CONFLICT (key) DO NOTHING
    `);

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export async function addParticipant(name) {
  await initDB();
  try {
    const result = await pool.query(
      'INSERT INTO participants (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Participant already exists');
    }
    throw error;
  }
}

export async function getParticipants() {
  await initDB();
  const result = await pool.query('SELECT name FROM participants ORDER BY name');
  return result.rows.map(row => row.name);
}

export async function addCalories(participantName, date, calories, weekNumber) {
  await initDB();
  try {
    // Check if entry exists
    const existing = await pool.query(
      'SELECT calories FROM calories WHERE participant_name = $1 AND date = $2',
      [participantName, date]
    );

    if (existing.rows.length > 0) {
      // Add to existing calories
      const newTotal = existing.rows[0].calories + calories;
      const result = await pool.query(
        'UPDATE calories SET calories = $1 WHERE participant_name = $2 AND date = $3 RETURNING *',
        [newTotal, participantName, date]
      );
      return result.rows[0];
    } else {
      // Insert new entry
      const result = await pool.query(
        'INSERT INTO calories (participant_name, date, calories, week_number) VALUES ($1, $2, $3, $4) RETURNING *',
        [participantName, date, calories, weekNumber]
      );
      return result.rows[0];
    }
  } catch (error) {
    throw error;
  }
}

export async function getWeekData(weekNumber) {
  await initDB();
  const result = await pool.query(
    'SELECT * FROM calories WHERE week_number = $1',
    [weekNumber]
  );
  
  // Convert to the format expected by the frontend
  const weekData = {};
  result.rows.forEach(row => {
    const dateStr = row.date.toISOString().split('T')[0];
    if (!weekData[dateStr]) {
      weekData[dateStr] = {};
    }
    weekData[dateStr][row.participant_name] = row.calories;
  });
  
  return weekData;
}

export async function participantExists(name) {
  await initDB();
  const result = await pool.query(
    'SELECT 1 FROM participants WHERE name = $1',
    [name]
  );
  return result.rows.length > 0;
}

export async function getParticipantTotals() {
  await initDB();
  const result = await pool.query(`
    SELECT
      p.name,
      COALESCE(SUM(c.calories), 0) as total_calories
    FROM participants p
    LEFT JOIN calories c ON p.name = c.participant_name
    GROUP BY p.name
    ORDER BY total_calories DESC
  `);
  return result.rows;
}

export async function getCurrentWeek() {
  await initDB();
  const result = await pool.query(
    'SELECT value FROM settings WHERE key = $1',
    ['current_week']
  );
  return result.rows.length > 0 ? parseInt(result.rows[0].value) : 1;
}

export async function setCurrentWeek(weekNumber) {
  await initDB();
  if (weekNumber >= 1 && weekNumber <= 5) {
    await pool.query(
      'UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2',
      [weekNumber.toString(), 'current_week']
    );
    return true;
  }
  return false;
}