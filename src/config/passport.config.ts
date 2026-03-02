import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { authService } from '../modules/auth/auth.service';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    // passport config ফাইলে
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails![0].value;
        const googleId = profile.id;
        const name = profile.displayName;
        const photoUrl = profile.photos?.[0]?.value || '';

        // গুগল থেকে জেন্ডার বের করা (গুগল অনেক সময় gender ফিল্ড পাঠায় না যদি ইউজার ওটা পাবলিক না রাখে)
        const gender = profile._json.gender || null;

    
        const { user } = await authService.findOrCreateGoogleUser({
          name,
          email,
          googleId,
          photoUrl,
          gender, 
        });

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);
