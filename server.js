require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const urlDatabase = require("./models/shortUrl");
const app = express();

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.1ojene6.mongodb.net/urlShortener`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const data = {
    full: req.query.full || "",
    short: req.query.short || "",
    message: req.query.message || "",
  };

  res.render("index", data);
});

app.post("/", async (req, res) => {
  fullUrl = req.body["url-input"];
  shortUrl = req.body["custom-input"];

  const data = await urlDatabase.findOne({
    short: req.body["custom-input"],
  });

  // already taken
  if (data != null) {
    return res.redirect(`/?short=${shortUrl}&full=${fullUrl}&message=taken`);
  }

  await urlDatabase.create({
    full: fullUrl,
    short: shortUrl,
  });
  res.redirect(`/?short=${shortUrl}&full=${fullUrl}&message=success`);
});

app.get("/database", async (req, res) => {
  const shortUrls = await urlDatabase.find();
  res.render("database", { shortUrls: shortUrls });
});

app.get("/:shortUrl", async (req, res) => {
  const data = await urlDatabase.findOne({ short: req.params.shortUrl });
  if (data == null) {
    return res.send("<h1>URL Not Found</h1>");
  }
  res.redirect(data.full);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
