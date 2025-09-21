import { addParticipant } from '../../lib/storage.js';

export async function POST({ request }) {
  try {
    const { name } = await request.json();
    
    if (!name || name.trim() === '') {
      return new Response(JSON.stringify({ error: 'Participant name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await addParticipant(name.trim());

    return new Response(JSON.stringify({ 
      success: true, 
      message: `${name.trim()} added to contest`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Add participant error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}