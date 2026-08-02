/**
 * Brief submissions → Telegram.
 *
 * This exists so the bot token never reaches a browser. The form used to call
 * api.telegram.org directly with `import.meta.env.VITE_TELEGRAM_BOT_TOKEN`, and
 * Vite inlines every VITE_* value into the client bundle at build time — which
 * put the token, and the chat id it posts to, in a public JS file for anyone to
 * read. Here the credentials stay in the function's own environment.
 *
 * Env (set in Netlify → Site settings → Environment variables, WITHOUT the
 * VITE_ prefix so they can never be bundled):
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *
 * Written as plain ESM rather than TypeScript: tsconfig.app.json only covers
 * `src`, so a .ts file here would sit outside the project's typecheck and give
 * a false sense of being checked.
 */

// Telegram's hard limit is 4096 characters per message; leave headroom for the
// part header we prepend below.
const MAX_CHARS = 4000;
// Guard against a runaway payload turning into a flood of messages.
const MAX_PARTS = 10;
// A brief is a form, not a file upload — anything past this is not a brief.
const MAX_BODY = 64 * 1024;

const splitIntoChunks = (text) => {
  if (text.length <= MAX_CHARS) return [text];

  const chunks = [];
  let current = '';

  for (const line of text.split('\n')) {
    if (line.length > MAX_CHARS) {
      if (current) {
        chunks.push(current.trim());
        current = '';
      }
      for (let i = 0; i < line.length; i += MAX_CHARS - 50) {
        chunks.push(line.substring(i, i + MAX_CHARS - 50));
      }
      continue;
    }
    if ((current + '\n' + line).length > MAX_CHARS) {
      chunks.push(current.trim());
      current = line;
    } else {
      current = current ? current + '\n' + line : line;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
};

const sendMessage = async (token, chatId, text, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      },
    );

    if (response.ok) return;

    const data = await response.json().catch(() => ({}));

    if (response.status === 429) {
      const wait = data.parameters?.retry_after ?? 5;
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }

    // Telegram's own error text can quote the request — never let it travel
    // back to the browser. Log it for us, return something generic to them.
    console.error('Telegram rejected a brief:', response.status, data.description);
    throw new Error('telegram_rejected');
  }
  throw new Error('telegram_rate_limited');
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Brief function is missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID');
    return { statusCode: 500, body: JSON.stringify({ error: 'not_configured' }) };
  }

  const raw = event.body ?? '';
  if (raw.length > MAX_BODY) {
    return { statusCode: 413, body: JSON.stringify({ error: 'too_large' }) };
  }

  let text;
  try {
    ({ text } = JSON.parse(raw));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'bad_json' }) };
  }

  if (typeof text !== 'string' || !text.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'empty' }) };
  }

  let chunks = splitIntoChunks(text);
  if (chunks.length > MAX_PARTS) {
    chunks = chunks.slice(0, MAX_PARTS);
    chunks[MAX_PARTS - 1] +=
      '\n\n⚠️ _Сообщение было сокращено из-за большого объёма_';
  }

  try {
    for (let i = 0; i < chunks.length; i++) {
      const body =
        chunks.length > 1 && i > 0
          ? `📋 *БРИФ (часть ${i + 1}/${chunks.length})*\n\n${chunks[i]}`
          : chunks[i];
      await sendMessage(token, chatId, body);
      // Telegram rate-limits bursts; pace the parts.
      if (i < chunks.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  } catch (error) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: error.message ?? 'send_failed' }),
    };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
