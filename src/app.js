import express from 'express';
import session from 'express-session';
import connectDB from './config/mongo.js';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import shortUrlRoutes from './routes/url.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(session({
    secret:  process.env.SESSION_SECRET,
    resave: false,    
    saveUninitialized: false, 
  })); 
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', shortUrlRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
