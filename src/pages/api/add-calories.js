import { addCaloriesForDate, participantExists } from '../../lib/storage.js';

export async function POST({ request }) {
  try {
    const { date, participant, calories, week } = await request.json();
    
    if (!date || !participant || calories === undefined || !week) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (calories < 0) {
      return new Response(JSON.stringify({ error: 'Calories must be 0 or greater' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if participant exists
    if (!(await participantExists(participant))) {
      return new Response(JSON.stringify({ error: 'Participant not found. Please add them first.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await addCaloriesForDate(date, participant, parseInt(calories), week);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Added ${calories} calories for ${participant} on ${date}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Add calories error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}