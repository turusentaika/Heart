// Minimal server proxy to keep GEMINI_API_KEY on the server-side.
// Usage:
// 1) Set environment variables (e.g., in .env):
//    GEMINI_API_KEY=your_key_here
//    API_BACKEND_URL=https://api.google.example/v1/gemini
// 2) Start server: `node server.js` (Node 18+ recommended for built-in fetch)

const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3001;
const TARGET = process.env.API_BACKEND_URL || '';

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJSON(res, 200, { status: 'ok' });
  }

  if (url.pathname.startsWith('/api')) {
    // Example: POST /api/gemini -> forward to API_BACKEND_URL if configured
    if (!process.env.GEMINI_API_KEY) {
      return sendJSON(res, 500, { error: 'Server missing GEMINI_API_KEY' });
    }

    if (!TARGET) {
      return sendJSON(res, 501, { error: 'API_BACKEND_URL not configured on server' });
    }

    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();

      // Forward request to configured backend, attaching the server-side key
      const forwardRes = await fetch(TARGET, {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: body || undefined,
      });

      const respText = await forwardRes.text();
      res.writeHead(forwardRes.status, { 'Content-Type': forwardRes.headers.get('content-type') || 'text/plain' });
      res.end(respText);
    } catch (err) {
      console.error('Proxy error:', err);
      return sendJSON(res, 502, { error: 'Proxy error', detail: String(err) });
    }
    return;
  }

  // Not found
  sendJSON(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
