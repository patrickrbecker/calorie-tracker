import { clearAllContestData } from '../../lib/db.js';

export async function POST({ request }) {
  try {
    await clearAllContestData();

    return new Response(JSON.stringify({
      success: true,
      message: 'All contest data cleared successfully. Database reset for production use.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Clear data error:', error);
    return new Response(JSON.stringify({ error: 'Failed to clear data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}