
  const LocalStrategy = require('passport-local').Strategy,
  passportJWT = require('passport-jwt'),
  ExtractJwt = passportJWT.ExtractJwt,
  JwtStrategy = passportJWT.Strategy;


module.exports = (passport) => {
// Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      _id: id
    }, (err, user) => {
      user.email = null;
      user.facebook = null;
      user.hashed_password = null;
      done(err, user);
    });
  });

  /**
   * create jwt strategy
   */
  const jwtOptions = {};
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
  jwtOptions.secretOrKey = process.env.TOKENSECRET;
 console.log('process.env.TOKENSECRET', process.env.TOKENSECRET);
  passport.use(new JwtStrategy(jwtOptions, 
    (jwt_payload, next) => {
      console.log('payload received', jwt_payload);
      // usually this would be a database call:
      console.log(jwt_payload.email)
      var user = User.findOne({email: jwt_payload.email});
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    }
   ));
};
