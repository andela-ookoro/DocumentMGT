
import Strategy from 'passport-local';
import passportJWT from 'passport-jwt';
import model from '../models/index';

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = Strategy.Strategy;
const User = model.user;


module.exports = (passport) => {
// Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((email, done) => {
    User.find({
      where: { email: user.email },
    })
    .then((foundUser) => {
      done(err, user);
    });
  });

  /**
   * create jwt strategy
   */
  const jwtOptions = {};
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
  jwtOptions.secretOrKey = process.env.TOKENSECRET;
  passport.use(new JwtStrategy(jwtOptions,
    (jwt_payload, next) => {
      // usually this would be a database call:
      User.findOne({ email: jwt_payload.email })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      })
      .catch(() => next(null, false));
    }
   ));
};
