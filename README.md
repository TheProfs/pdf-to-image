[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

# pdf-to-image
[WIP] - Render PDF's to images on the client

> Because paying for servers is uh, uh

## Tests

```bash
# Works only on OSX with Google Chrome installed
$ npm test
```

Otherwise just visit `/test/index.html`.
While the build distribution is ES5 compatible, the tests require an
ES6 capable browser.

## Contributing?

```bash
# Install deps
$ sudo npm install -g mocha chai babel-cli xo

# Run linter
$ npm run lint

# Transpile ES2017 in src/ to ES5 in dist/
$ npm run build
```
