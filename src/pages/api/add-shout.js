import { addShoutboxMessage } from '../../lib/db.js';

export async function POST({ request }) {
  try {
    const { username, message } = await request.json();

    const trimmedUsername = username?.trim();
    const trimmedMessage = message?.trim();

    if (!trimmedUsername || !trimmedMessage) {
      return new Response(JSON.stringify({ error: 'Username and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Validate username length
    if (trimmedUsername.length > 255) {
      return new Response(JSON.stringify({ error: 'Username too long (max 255 characters)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Validate message length
    if (trimmedMessage.length > 500) {
      return new Response(JSON.stringify({ error: 'Message too long (max 500 characters)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security: Basic content filtering (prevent empty messages after trim)
    if (trimmedMessage.length === 0) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await addShoutboxMessage(trimmedUsername, trimmedMessage);

    return new Response(JSON.stringify({
      success: true,
      message: 'Shout added successfully',
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Add shout API error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to add shout'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}