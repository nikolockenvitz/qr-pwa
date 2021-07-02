# QR PWA

Create and scan QR codes with this Progressive Web App on https://nikolockenvitz.github.io/qr-pwa.

![Screenshot](https://github.com/nikolockenvitz/website/raw/master/projects/img/qr-pwa.png)


Used libraries:
* https://github.com/nimiq/qr-scanner
* https://github.com/nayuki/QR-Code-generator

# build and deploy
*browserify* (together with *babelify*) is used to bundle all files
```
npm install
npm run build
```

If you want to deploy it to a web-/file-server, you will need the following files:
`icons/`, `lib/`, `bundle.js`, `favicon32x32.png`, `index.html`, `pwa.js`, `site.webmanifest`, `style.css` and `sw.js`