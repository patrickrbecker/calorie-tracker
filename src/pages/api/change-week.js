import { setCurrentWeek } from '../../lib/storage.js';

export async function POST({ request }) {
  try {
    const { week } = await request.json();
    
    if (!week || week < 1) {
      return new Response(JSON.stringify({ error: 'Valid week number is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await setCurrentWeek(week);

    return new Response(JSON.stringify({ 
      success: true, 
      currentWeek: week
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Change week error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}