import express from 'express';
import session from 'express-session';
import connectDB from './config/mongo.js';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import shortUrlRoutes from './routes/url.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = YAML.load(join(__dirname, 'swagger.yaml'));

const servers = [];

if (process.env.RENDER_EXTERNAL_URL) {
    servers.push({
        url: process.env.RENDER_EXTERNAL_URL,
        description: 'Production server',
    });
} else {
    servers.push({
        url: process.env.SERVER_URL || `http://localhost:${PORT}`,
        description: 'Development server',
    });
}

swaggerDocument.servers = servers;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', shortUrlRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
      });
  }
  

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});


export default app;