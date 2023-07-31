const express = require("express");
const mongoose = require("mongoose");
const urlDatabase = require("./models/shortUrl");
const app = express();

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  // const shortUrls = await urlDatabase.find();
  // res.render("index", { shortUrls: shortUrls });
  res.render("index", { objs: req.query });
});

app.get("/success/:short", (req, res) => {
  res.render("success", { short: req.params.short });
});

app.post("/shorturl", async (req, res) => {
  fullUrl = req.body["url-input"];
  shortUrl = req.body["custom-input"];

  const data = await urlDatabase.findOne({
    short: req.body["custom-input"],
  });

  // already taken
  if (data != null) {
    return res.redirect(data.full);
  }

  await shortUrl.create({
    full: fullUrl,
    short: shortUrl,
  });
  res.redirect(`/success/${req.body["custom-input"]}`);
});

// app.get("/source-route", (req, res) => {
//   const dataToPass = "Hello from the source route";
//   res.redirect(`/destination-route?data=${encodeURIComponent(dataToPass)}`);
// });

// app.get("/destination-route", (req, res) => {
//   const data = req.query.data;
//   console.log(data)
//   res.redirect("/");
// });

app.get("/:shortUrl", async (req, res) => {
  const data = await urlDatabase.findOne({ short: req.params.shortUrl });
  if (data == null) {
    return res.render("not_found");
  }
  res.redirect(data.full);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
