const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const SteamStrategy = require("passport-steam").Strategy;

const keys = require("./config/keys");

const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const questsRouter = require("./routes/quests");
const authRouter = require("./routes/auth");
const paymentRouter = require("./routes/payments");
const patreonRouter = require("./routes/patreon");
const cosmeticsRouter = require("./routes/cosmetics");

const players = require("./db/players");

const port = process.env.PORT || 3000;

const app = express();

// -----------------------------------------------------
// Steam OpenID stuff

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(async function(user, next) {
  // create the user if they don't yet exist
  const steamid = user.id;
  const username = user.displayName;

  const playerExists = await players.doesPlayerExist(steamid);
  if (!playerExists) {
    await players.createNewPlayer(steamid, username);
  }

  next(null, user);
});

passport.deserializeUser(function(obj, next) {
  next(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
const baseUrl = process.env.IS_PRODUCTION
  ? "https://www.pathofguardians.com"
  : "http://localhost:3000";
passport.use(
  new SteamStrategy(
    {
      returnURL: `${baseUrl}/api/auth/steam/return`,
      realm: baseUrl,
      apiKey: keys.steamAPIKey,
    },
    function(identifier, profile, next) {
      return next(null, profile);
    }
  )
);

let sess = {
  secret: keys.sessionKey,
  name: "id",
  resave: false,
  saveUninitialized: true,
  cookie: {},
};

if (process.env.IS_PRODUCTION) {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

app.use(session(sess));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("short"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "client/dist")));

// app.use("/api/test", testRouter);
app.use("/api/games", gamesRouter);
app.use("/api/players", playersRouter);
app.use("/api/quests", questsRouter);
app.use("/api/auth", authRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/patreon", patreonRouter);
app.use("/api/cosmetics", cosmeticsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
