import express from 'express';
import session from 'express-session';
import connectDB from './config/mongo.js';
import passport from './config/passport.js'; // Ensure this is properly exported as a module
import authRoutes from './routes/auth.js';
import shortUrlRoutes from './routes/url.js';
import  dashboard  from './controllers/dashboard.js';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/shorten', shortUrlRoutes);
app.get('/dashboard', dashboard);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
