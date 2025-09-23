import { getParticipants } from '../../lib/db.js';

export async function GET() {
  try {
    console.log('Testing database connection...');
    const participants = await getParticipants();
    console.log('Got participants:', participants);

    return new Response(JSON.stringify({
      success: true,
      message: 'Database connection working',
      participants: participants
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}