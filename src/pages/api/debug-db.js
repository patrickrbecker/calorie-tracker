import { getParticipants, getWeekData } from '../../lib/db.js';

export async function GET() {
  try {
    const participants = await getParticipants();
    const weekData = await getWeekData(1);
    
    const data = {
      participants: participants,
      week1Data: weekData,
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}