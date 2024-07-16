const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
const { getUserByEmail, insertUser } = require('../../databaseManager/index');

const GoogleStrategy = passportGoogle.Strategy;

function useGoogleStrategy() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID || '',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    if (!profile._json.email) throw new Error("User does not have email");

                    let user = await getUserByEmail(profile._json.email);

                    if (user) { 
                        done(null, user);
                    } else { 
                        const newUser = {
                            username: profile._json.name,
                            email: profile._json.email,
                        };
                        user = await insertUser(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                    done(err);
                }
            }
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}

module.exports = { useGoogleStrategy };
