import { participantExists } from '../../lib/db.js';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NO_SSL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function POST({ request }) {
  try {
    const { date, participant, calories, week } = await request.json();

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

    // Get the previous value for rollback capability
    const previousResult = await pool.query(
      'SELECT calories FROM calories WHERE participant_name = $1 AND date = $2',
      [trimmedParticipant, date]
    );

    const previousValue = previousResult.rows.length > 0 ? previousResult.rows[0].calories : null;

    // Update the calories (replace, don't add)
    if (previousResult.rows.length > 0) {
      // Update existing entry
      const result = await pool.query(
        'UPDATE calories SET calories = $1, updated_at = NOW() WHERE participant_name = $2 AND date = $3 RETURNING *',
        [numCalories, trimmedParticipant, date]
      );

      return new Response(JSON.stringify({
        success: true,
        message: `Updated ${trimmedParticipant} calories for ${date} to ${numCalories}`,
        previousValue: previousValue,
        newValue: numCalories
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Create new entry (shouldn't happen in edit mode, but handle it)
      const result = await pool.query(
        'INSERT INTO calories (participant_name, date, calories, week_number) VALUES ($1, $2, $3, $4) RETURNING *',
        [trimmedParticipant, date, numCalories, week]
      );

      return new Response(JSON.stringify({
        success: true,
        message: `Created new entry: ${numCalories} calories for ${trimmedParticipant} on ${date}`,
        previousValue: null,
        newValue: numCalories
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Update calories error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}