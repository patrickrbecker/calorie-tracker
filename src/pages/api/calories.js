import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST({ request }) {
  try {
    const { username, calories } = await request.json();
    
    if (!username || username.trim() === '') {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!calories || calories <= 0) {
      return new Response(JSON.stringify({ error: 'Valid calorie amount is required' }), {
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

    // Find the user
    const userIndex = users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'User not found. Please register first.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add calories to user
    const today = new Date().toDateString();
    const calorieEntry = {
      calories: parseInt(calories),
      date: new Date().toISOString(),
      dateString: today
    };

    users[userIndex].entries.push(calorieEntry);
    users[userIndex].totalCalories += parseInt(calories);

    // Save to file
    writeFileSync(dataPath, JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ 
      success: true, 
      user: users[userIndex],
      entry: calorieEntry
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Calorie logging error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}