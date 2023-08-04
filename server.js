require("dotenv").config();
const express = require("express");
const { fetchAll, fetchOne, writeData, deleteData } = require("./public/databaseFunctions");
const app = express();

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

  const data = await fetchOne(shortUrl);

  // already taken
  if (data != null) {
    return res.redirect(`/?short=${shortUrl}&full=${fullUrl}&message=taken`);
  }

  const newData = {};
  newData[shortUrl] = fullUrl;

  writeData(newData);
  res.redirect(`/?short=${shortUrl}&full=${fullUrl}&message=success`);
});

app.get("/database", async (req, res) => {
  const data = await fetchAll();
  res.render("database", { data: data });
});

app.get("/admin/:password", (req, res) => {
  if (req.params.password !== process.env.ADMIN_PASSWORD) {
    return res.redirect("/");
  }
  res.render("admin");
});

app.post("/admin", (req, res) => {
  if (req.body.key) {
    deleteData(req.body.key);
  }
  res.redirect(`/admin/${process.env.ADMIN_PASSWORD}`);
})

app.get("/:shortUrl", async (req, res) => {
  const data = await fetchOne(req.params.shortUrl);
  if (data == null) {
    return res.send("<h1>URL Not Found</h1>");
  }
  res.redirect(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
