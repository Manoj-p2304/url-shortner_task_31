import express from 'express';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/mongo';
import authRoutes from './routes/auth';
import shortUrlRoutes from './routes/url';
import { dashboard } from './controllers/dashboard';
import './config/passport';

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
