import { userExists, addUser } from '../../lib/storage.js';

export async function POST({ request }) {
  try {
    const { username } = await request.json();
    
    if (!username || username.trim() === '') {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if username already exists
    if (await userExists(username)) {
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

    await addUser(newUser);

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