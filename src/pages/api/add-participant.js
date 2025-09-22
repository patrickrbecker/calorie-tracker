import { addParticipant } from '../../lib/db.js';

export async function POST({ request }) {
  try {
    const { name } = await request.json();
    
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return new Response(JSON.stringify({ error: 'Participant name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Limit name length and check for suspicious patterns
    if (trimmedName.length > 50) {
      return new Response(JSON.stringify({ error: 'Participant name too long (max 50 characters)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Block script tags and other suspicious content
    if (/<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i.test(trimmedName)) {
      return new Response(JSON.stringify({ error: 'Invalid characters in participant name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await addParticipant(trimmedName);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `${trimmedName} added to contest`
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