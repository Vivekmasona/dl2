const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
// const fs = require("fs");

const corsOptions = {
  origin: "https://getset.netlify.app", // change this origin as your like
  // origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.static("./static"));
const port = process.env.PORT || 3000;

app.get("/", (res) => {
  res.render("index.html");
});

app.get("/get", async (req, res) => {
  const url = req.query.url;
  console.log(url);
  const info = await ytdl.getInfo(url);
  const title = info.AudioDetails.title;
  const thumbnail = info.AudioDetails.thumbnails[9].url;
  let formats = info.formats;

  const audioFormats = ytdl.filterFormats(info.formats, "m4a");
  // const format = ytdl.chooseFormat(info.formats, { quality: "m4a" });
  formats = formats.filter((format) => format.hasAudio === true);

  res.send({ title, thumbnail, audioFormats, formats });
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  // const info = await ytdl.getInfo(url);
  // const title = info.AudioDetails.title;

  res.header("Content-Disposition", `attachment;  filename="file.m4a"`);
  try {
    ytdl(url, { itag }).pipe(res);
  } catch (err) {
    console.log(err);
  }
});

// app.get('*', (req, res) => {
//   res.render('error')
// })

app.listen(port, () => {
  console.log("Running ...");
});
