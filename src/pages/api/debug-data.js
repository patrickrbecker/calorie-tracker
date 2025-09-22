import { getParticipants, getParticipantTotals, getCurrentWeek, getAllWeeksData } from '../../lib/db.js';

export async function GET() {
  try {
    const participants = await getParticipants();
    const participantTotals = await getParticipantTotals();
    const currentWeek = await getCurrentWeek();
    const allWeeksData = await getAllWeeksData();

    const data = {
      participants,
      participantTotals,
      currentWeek,
      allWeeksData
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