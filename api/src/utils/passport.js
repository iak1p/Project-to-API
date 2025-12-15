const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies.token;
  }

  return jwt;
};

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]);
  opts.secretOrKey = "TEST";

  passport.use(
    "jwt",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const customer = await db("users")
          .where({ id: jwt_payload.id })
          .first();

        if (!customer) {
          return done(null, false, {
            message: "You have not enough permissions for this operation",
          });
        }

        return done(null, customer);
      } catch (err) {
        console.error("Error happened on server:", err);
        return done(err, false);
      }
    })
  );
};
