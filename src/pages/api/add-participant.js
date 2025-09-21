import { addParticipant } from '../../lib/storage.js';

export async function POST({ request }) {
  try {
    const { name } = await request.json();
    console.log('API: Adding participant:', name);
    
    if (!name || name.trim() === '') {
      console.log('API: Empty name provided');
      return new Response(JSON.stringify({ error: 'Participant name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await addParticipant(name.trim());
    console.log('API: Participant added successfully:', result);

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