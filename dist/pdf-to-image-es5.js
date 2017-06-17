/* eslint unicorn/no-abusive-eslint-disable: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-undef: 0 */

/*
 * PDFtoImage
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PdfToImage = function (_EventEmitter) {
  _inherits(PdfToImage, _EventEmitter);

  function PdfToImage() {
    _classCallCheck(this, PdfToImage);

    return _possibleConstructorReturn(this, (PdfToImage.__proto__ || Object.getPrototypeOf(PdfToImage)).apply(this, arguments));
  }

  _createClass(PdfToImage, [{
    key: 'toImages',
    // eslint-disable-line no-unused-vars

    value: function toImages(pdfFile) {
      var _this2 = this;

      var pages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!pdfFile) {
        throw new Error('No PDF file passed');
      }

      PDFJS.getDocument(pdfFile).then(function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pdf) {
          var _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pageNum;

          return regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  pages = pages.length ? pages : _this2._createSequence(pdf.pdfInfo.numPages);

                  _loop = regeneratorRuntime.mark(function _loop(pageNum) {
                    return regeneratorRuntime.wrap(function _loop$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return pdf.getPage(pageNum // eslint-disable-line no-await-in-loop
                            ).then(_this2._renderPageAsBase64.bind(_this2)).then(_this2._base64ToFile.bind(_this2)).then(function (file) {
                              _this2.emit('page', { pageNum: pageNum, file: file });
                            });

                          case 2:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _loop, _this2);
                  });
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context2.prev = 5;
                  _iterator = pages[Symbol.iterator]();

                case 7:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context2.next = 13;
                    break;
                  }

                  pageNum = _step.value;
                  return _context2.delegateYield(_loop(pageNum), 't0', 10);

                case 10:
                  _iteratorNormalCompletion = true;
                  _context2.next = 7;
                  break;

                case 13:
                  _context2.next = 19;
                  break;

                case 15:
                  _context2.prev = 15;
                  _context2.t1 = _context2['catch'](5);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 19:
                  _context2.prev = 19;
                  _context2.prev = 20;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 22:
                  _context2.prev = 22;

                  if (!_didIteratorError) {
                    _context2.next = 25;
                    break;
                  }

                  throw _iteratorError;

                case 25:
                  return _context2.finish(22);

                case 26:
                  return _context2.finish(19);

                case 27:

                  _this2.emit('finish');

                case 28:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee, _this2, [[5, 15, 19, 27], [20,, 22, 26]]);
        }));

        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }(), function (err) {
        _this2.emit('error', { err: err });
        throw new Error(err);
      });
    }
  }, {
    key: '_base64ToFile',
    value: function _base64ToFile(base64) {
      var blob = new Blob([base64], { type: 'application/pdf' });

      // @NOTE
      // File constructor errors in PhantomJS, the test driver used for testing
      try {
        return new File([blob], 'export.pdf');
      } catch (err) {
        return 'File constructor not supported';
      }
    }
  }, {
    key: 'getNumOfPages',
    value: function getNumOfPages(pdfFile) {
      return PDFJS.getDocument(pdfFile).then(function (pdf) {
        return pdf.pdfInfo.numPages;
      });
    }
  }, {
    key: '_renderPageAsBase64',
    value: function _renderPageAsBase64(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);
      var canvas = this._createTempCanvas(viewport.width, viewport.height);
      var ctx = canvas.getContext('2d');

      return page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise.then(function () {
        return canvas.toDataURL('image/jpeg');
      });
    }
  }, {
    key: '_createTempCanvas',
    value: function _createTempCanvas(width, height) {
      var canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      canvas.width = width;
      canvas.height = height;

      return canvas;
    }
  }, {
    key: '_createSequence',
    value: function _createSequence(max) {
      return Array.from(Array(max).keys()).slice(1);
    }
  }]);

  return PdfToImage;
}(EventEmitter);
