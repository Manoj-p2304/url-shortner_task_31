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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = YAML.load(join(__dirname, 'swagger.yaml'));

const servers = [];

// Production server
if (process.env.RENDER_EXTERNAL_URL) {
  servers.push({
    url: process.env.RENDER_EXTERNAL_URL,
    description: 'Production server'
  });
}

// Development server
servers.push({
  url: process.env.SERVER_URL || `http://localhost:${PORT}`,
  description: 'Development server'
});

swaggerDocument.servers = servers;

// Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', shortUrlRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});