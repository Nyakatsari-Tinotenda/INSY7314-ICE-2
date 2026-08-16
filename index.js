// index.js
// Entry point for the Structured Backend API (INSY7314 ICE Task 2)
// Wires together security headers, controlled CORS, JSON body parsing,
// routes, and the central error handler.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

const movieRoutes = require('./routes/movieRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 4000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Reduce unnecessary technology disclosure - attackers should not be
// given more information than necessary about the server stack.
app.disable('x-powered-by');

// ---------- Security Headers (Helmet + CSP) ----------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", CLIENT_ORIGIN],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: 'same-site' }
  })
);

// ---------- Controlled CORS Configuration ----------
// Only the configured frontend origin is allowed - avoid a blanket
// app.use(cors()) which would allow every origin.
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ---------- Body Parsing ----------
// Limit request body size to reduce risk of oversized payloads.
app.use(express.json({ limit: '10kb' }));

// ---------- Root Route ----------
app.get('/', (req, res) => {
  res.status(200).json({
    app: process.env.APP_NAME || 'MovieAPI',
    message: 'API is running securely'
  });
});

// ---------- Health Check Route ----------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    protocol: USE_HTTPS ? 'HTTPS' : 'HTTP'
  });
});

// ---------- API Routes ----------
app.use('/api/movies', movieRoutes);

// ---------- 404 Handler (unmatched routes) ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---------- Central Error Handler ----------
// Must be registered last, after all other app.use() and route calls.
app.use(errorHandler);

// ---------- Start Server (HTTP or HTTPS depending on USE_HTTPS) ----------
if (USE_HTTPS) {
  const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs', 'localhost-key.pem');
  const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs', 'localhost-cert.pem');

  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });
}
