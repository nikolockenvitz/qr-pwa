const fs = require("fs");
const ncp = require("ncp").ncp;

const dir = "dist/";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

for (const file of ["icons/", "lib/", "bundle.js", "favicon32x32.png", "index.html", "pwa.js", "site.webmanifest", "style.css", "sw.js"]) {
  ncp(file, dir + file, (err) => {
    if (err) throw err;
  });
}
