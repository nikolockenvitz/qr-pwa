const fs = require("fs");
const browserify = require("browserify");
console.log("build started at \x1b[33m" + (new Date()).toTimeString().split(" ").join("\x1b[0m "));
browserify("./app.js")
  .transform("babelify", {presets: ["@babel/preset-env"]})
  .bundle()
  .pipe(fs.createWriteStream("bundle.js"));