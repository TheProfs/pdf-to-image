[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

# pdf-to-image
> Progressively render PDF's as images on the client -
cleanly wraps [Mozilla/PDF.js][1]

## Usage

Depends on [Mozilla/PDF.js][1], you can find distribution versions [here][2]
or just grab it from a [CDN][3]

```html
<!-- Include PDF.js and pdf-to-image.js -->
<script src="dist/pdf-to-image-dist.js"></script>
<script src="pdf.min.js"></script>
```

## API

### Render all pages

```javascript
const pdfToImage = new PdfToImage();

pdfToImage.addListener('page', result => {
/*
 * result includes:
 * - page number
 * - 2 Base64's; a full-sized image & an A4 thumbnail of the page
 */
});

pdfToImage.addListener('finish', () => {
// called when all pages have finished rendering
});

pdfToImage.addListener('error', err => {
// called if an error occurred during rendering
});

// Where file is PDF File created by a FileReader instance
pdfToImage.toImages(file);
```

### Render specific pages

```javascript

// same as above but print only pages 1,2 & 5
pdfToImage.toImages(file, [1, 2, 5]);
```

## Running Tests

```bash
# If on OSX with Google Chrome installed,
$ npm test
# otherwise just visit `/test/index.html`.
```
While the build distribution is ES5 compatible, the tests require an ES6 capable
browser.

## Contributing?

```bash
# Install deps
$ sudo npm install -g mocha chai babel-cli xo

# Run linter
$ npm run lint

# Transpile ES2017 in src/ to ES5 in dist/
$ npm run build
```

## Authors

- Nicholas Kyriakides, [@nicholaswmin][4], <nik.kyriakides@gmail.com>

## Owners

- [The Profs LTD][5]

## License

All portions of the source code are proprietary,
excluding third-party libraries.


[1]: https://mozilla.github.io/pdf.js/
[2]: https://github.com/mozilla/pdfjs-dist
[3]: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/1.8.428/pdf.min.js
[4]:https://github.com/nicholaswmin
[5]:https://github.com/TheProfs
