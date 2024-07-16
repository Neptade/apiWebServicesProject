const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
// const { getUserByEmail, insertUser } = require('../../databaseManager/index');

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

                    let reponse = await fetch(`http://localhost:8085/dbmanager/getUserByEmail/${profile._json.email}`);
                    let user = await reponse.json();

                    if (user) { 
                        done(null, user);
                        console.log(user.email + " has logged in");
                    } else { 
                        const newUser = {
                            username: profile._json.name,
                            email: profile._json.email,
                        };
                        let response = await fetch(`http://localhost:8085/dbmanager/insertUser`, { 
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                              },
                            body: JSON.stringify(newUser)
                        });
                        let createdUser = await response.json();
                        console.log(createdUser);
                        done(null, createdUser);
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
