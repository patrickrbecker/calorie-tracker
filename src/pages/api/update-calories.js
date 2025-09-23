import { participantExists, updateCalories } from '../../lib/db.js';

export async function POST({ request }) {
  try {
    console.log('Update calories API called');
    console.log('POSTGRES_URL_NO_SSL available:', !!process.env.POSTGRES_URL_NO_SSL);
    console.log('updateCalories function available:', typeof updateCalories);
    console.log('participantExists function available:', typeof participantExists);

    const { date, participant, calories, week } = await request.json();
    console.log('Request data:', { date, participant, calories, week });

    const trimmedParticipant = participant?.trim();

    if (!date || !trimmedParticipant || calories === undefined || !week) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Validate calories is a number and within reasonable range
    const numCalories = parseInt(calories);
    if (isNaN(numCalories) || numCalories < 0 || numCalories > 50000) {
      return new Response(JSON.stringify({ error: 'Calories must be between 0 and 50,000' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Validate week number
    if (week < 1 || week > 5) {
      return new Response(JSON.stringify({ error: 'Invalid week number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if participant exists
    if (!(await participantExists(trimmedParticipant))) {
      return new Response(JSON.stringify({ error: 'Participant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update the calories using the db function
    const result = await updateCalories(trimmedParticipant, date, numCalories, week);

    return new Response(JSON.stringify({
      success: true,
      message: `Updated ${trimmedParticipant} calories for ${date} to ${numCalories}`,
      previousValue: result.previousValue,
      newValue: result.newValue
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update calories error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}