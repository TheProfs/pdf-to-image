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
														).then(_this2._renderPageOnCanvas.bind(_this2)).then(_this2._exportCanvasAsBase64.bind(_this2)).then(function (images) {
															_this2.emit('page', { pageNum: pageNum, images: images });
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
		key: '_exportCanvasAsBase64',
		value: function _exportCanvasAsBase64(canvas) {
			// A4 page in portrait: 210 x 297
			return {
				original: canvas.toDataURL('image/jpeg'),
				thumbnail: this._resampleCanvas(canvas, 210, 297, true).toDataURL('image/jpeg')
			};
		}
	}, {
		key: 'getNumOfPages',
		value: function getNumOfPages(pdfFile) {
			return PDFJS.getDocument(pdfFile).then(function (pdf) {
				return pdf.pdfInfo.numPages;
			});
		}
	}, {
		key: '_renderPageOnCanvas',
		value: function _renderPageOnCanvas(page) {
			var scale = 1.5;
			var viewport = page.getViewport(scale);
			var canvas = this._createTempCanvas(viewport.width, viewport.height);
			var ctx = canvas.getContext('2d');

			return page.render({
				canvasContext: ctx,
				viewport: viewport
			}).promise.then(function () {
				return canvas;
			});
		}

		/* eslint-disable */
		// Taken from: https://stackoverflow.com/a/18320662/1814486

	}, {
		key: '_resampleCanvas',
		value: function _resampleCanvas(canvas, width, height, resize_canvas) {
			var width_source = canvas.width;
			var height_source = canvas.height;
			width = Math.round(width);
			height = Math.round(height);

			var ratio_w = width_source / width;
			var ratio_h = height_source / height;
			var ratio_w_half = Math.ceil(ratio_w / 2);
			var ratio_h_half = Math.ceil(ratio_h / 2);

			var ctx = canvas.getContext("2d");
			var img = ctx.getImageData(0, 0, width_source, height_source);
			var img2 = ctx.createImageData(width, height);
			var data = img.data;
			var data2 = img2.data;

			for (var j = 0; j < height; j++) {
				for (var i = 0; i < width; i++) {
					var x2 = (i + j * width) * 4;
					var weight = 0;
					var weights = 0;
					var weights_alpha = 0;
					var gx_r = 0;
					var gx_g = 0;
					var gx_b = 0;
					var gx_a = 0;
					var center_y = (j + 0.5) * ratio_h;
					var yy_start = Math.floor(j * ratio_h);
					var yy_stop = Math.ceil((j + 1) * ratio_h);
					for (var yy = yy_start; yy < yy_stop; yy++) {
						var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
						var center_x = (i + 0.5) * ratio_w;
						var w0 = dy * dy; //pre-calc part of w
						var xx_start = Math.floor(i * ratio_w);
						var xx_stop = Math.ceil((i + 1) * ratio_w);
						for (var xx = xx_start; xx < xx_stop; xx++) {
							var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
							var w = Math.sqrt(w0 + dx * dx);
							if (w >= 1) {
								//pixel too far
								continue;
							}
							//hermite filter
							weight = 2 * w * w * w - 3 * w * w + 1;
							var pos_x = 4 * (xx + yy * width_source);
							//alpha
							gx_a += weight * data[pos_x + 3];
							weights_alpha += weight;
							//colors
							if (data[pos_x + 3] < 255) weight = weight * data[pos_x + 3] / 250;
							gx_r += weight * data[pos_x];
							gx_g += weight * data[pos_x + 1];
							gx_b += weight * data[pos_x + 2];
							weights += weight;
						}
					}
					data2[x2] = gx_r / weights;
					data2[x2 + 1] = gx_g / weights;
					data2[x2 + 2] = gx_b / weights;
					data2[x2 + 3] = gx_a / weights_alpha;
				}
			}
			//clear and resize canvas
			if (resize_canvas === true) {
				canvas.width = width;
				canvas.height = height;
			} else {
				ctx.clearRect(0, 0, width_source, height_source);
			}

			//draw
			ctx.putImageData(img2, 0, 0);

			return canvas;
		}
		/* eslint-enable */

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
