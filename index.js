const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const SteamStrategy = require("passport-steam").Strategy;
const pgSession = require("connect-pg-simple")(session);
const http = require("http");
const WebSocket = require("ws");

const keys = require("./config/keys");

const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const questsRouter = require("./routes/quests");
const authRouter = require("./routes/auth");
const paymentRouter = require("./routes/payments");
const patreonRouter = require("./routes/patreon");
const cosmeticsRouter = require("./routes/cosmetics");
const steamRouter = require("./routes/steam");
const logsRouter = require("./routes/logs");
const pollsRouter = require("./routes/polls");

const websocketHandler = require("./websocket/connection");

const { pool } = require("./db/index");
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
passport.serializeUser(async function (user, next) {
  // create the user if they don't yet exist
  const steamid = user.id;
  const username = user.displayName;

  const playerExists = await players.doesPlayerExist(steamid);
  if (!playerExists) {
    await players.createNewPlayer(steamid, username);
  }

  const { is_admin, poggers } = await players.getBasicPlayer(steamid);

  // Increment quest progress for logging into the website
  players.addQuestProgressByStat(steamid, "website_visits", 1);

  // add db info to the user
  user = {
    ...user,
    isAdmin: is_admin,
    poggers,
  };

  next(null, user);
});

passport.deserializeUser(function (obj, next) {
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
    function (identifier, profile, next) {
      return next(null, profile);
    }
  )
);

let sess = {
  store: new pgSession({
    pool: pool,
  }),
  secret: keys.sessionKey,
  name: "id",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2592000000,
  },
};

if (process.env.IS_PRODUCTION) {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

const sessionParser = session(sess);

app.use(sessionParser);

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

function skipLog(req, res) {
  var url = req.url;
  if (url.indexOf("?") > 0) url = url.substr(0, url.indexOf("?"));
  if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot|svg|otf)$/gi)) {
    return true;
  }
  return false;
}

app.use(morgan("short", { skip: skipLog }));

app.use(
  bodyParser.json({
    // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
    verify: function (req, res, buf) {
      var url = req.originalUrl;
      if (url.endsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);
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
app.use("/api/steam", steamRouter);
app.use("/api/logs", logsRouter);
app.use("/api/polls", pollsRouter);

/**
  Websocket Stuff
  Would like to move as much of this as possible to another file

*/
const server = http.createServer(app);
const wss = new WebSocket.Server({
  clientTracking: false,
  noServer: true,
});

server.on("upgrade", (req, socket, head) => {
  console.log("Parsing session from request...");

  sessionParser(req, {}, () => {
    if (!req.session.passport) {
      console.log("Session or Passport not found");
      socket.destroy();
      return;
    }

    const user = req.session.passport.user;
    if (!user) {
      console.log("Not logged in");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit("connection", ws, user);
    });
  });
});

wss.on("connection", function (ws, user) {
  websocketHandler(ws, user);
});

wss.on("error", function error(error) {
  console.log("websocket error");
  console.log(error);
});

wss.on("close", function close() {
  console.log("close websocket server");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/dist/index.html"));
});

const runningServer = app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");

  // Stops the server from accepting new connections and finishes existing connections.
  runningServer.close(function (err) {
    // if error, log and exit with error (1 code)
    if (err) {
      console.error(err);
      process.exit(1);
    }

    // close your database connection and exit with success (0 code)
    pool.end(() => {
      console.log("pool has ended");
      process.exit(0);
    });
  });
});
