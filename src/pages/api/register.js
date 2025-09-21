import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST({ request }) {
  try {
    const { username } = await request.json();
    
    if (!username || username.trim() === '') {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    const dataPath = join(dataDir, 'users.json');
    let users = [];

    // Read existing users
    if (existsSync(dataPath)) {
      const data = readFileSync(dataPath, 'utf-8');
      users = JSON.parse(data);
    }

    // Check if username already exists
    const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add new user
    const newUser = {
      username: username.trim(),
      totalCalories: 0,
      entries: [],
      joinedDate: new Date().toISOString()
    };

    users.push(newUser);

    // Save to file
    writeFileSync(dataPath, JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ success: true, user: newUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}