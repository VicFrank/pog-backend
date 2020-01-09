const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const testRouter = require("./routes/tests");
const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("short"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "client/dist")));

app.use("/api/test", testRouter);
app.use("/api/games", gamesRouter);
app.use("/api/players", playersRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
