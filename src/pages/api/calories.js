import { findUser, updateUser } from '../../lib/storage.js';

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

    // Find the user
    const user = await findUser(username);
    if (!user) {
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

    user.entries.push(calorieEntry);
    user.totalCalories += parseInt(calories);

    // Update user in storage
    await updateUser(username, user);

    return new Response(JSON.stringify({ 
      success: true, 
      user: user,
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