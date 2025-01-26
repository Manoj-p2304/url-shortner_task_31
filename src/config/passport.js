import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      accessType: 'offline',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile); // This will show user data

      // This is where you can store user information or handle the login
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
      });
      done(null, newUser);
    }
  )
);


passport.serializeUser((profile, done) => {
  done(null, {
    id: profile.id,
    googleId: profile.googleId,
    name: profile.name,
    email: profile.email
  });
});

passport.deserializeUser(async (userData, done) => {
  try {
    // Use userData.id instead of profile.id
    const user = await User.findById(userData.id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
