/* eslint unicorn/no-abusive-eslint-disable: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-undef: 0 */

/*
 * Event Emitter, from: https://github.com/Olical/EventEmitter
 */

/* eslint-disable */
!function(r){"use strict";function t(){}function n(n,e){if(i)return e.indexOf(n);for(var t=e.length;t--;)if(e[t]===n)return t;return-1}var e=t.prototype,i=Array.prototype.indexOf?!0:!1;e._getEvents=function(){return this._events||(this._events={})},e.getListeners=function(n){var r,e,t=this._getEvents();if("object"==typeof n){r={};for(e in t)t.hasOwnProperty(e)&&n.test(e)&&(r[e]=t[e])}else r=t[n]||(t[n]=[]);return r},e.getListenersAsObject=function(n){var e,t=this.getListeners(n);return t instanceof Array&&(e={},e[n]=t),e||t},e.addListener=function(i,r){var e,t=this.getListenersAsObject(i);for(e in t)t.hasOwnProperty(e)&&-1===n(r,t[e])&&t[e].push(r);return this},e.on=e.addListener,e.defineEvent=function(e){return this.getListeners(e),this},e.defineEvents=function(t){for(var e=0;e<t.length;e+=1)this.defineEvent(t[e]);return this},e.removeListener=function(i,s){var r,e,t=this.getListenersAsObject(i);for(e in t)t.hasOwnProperty(e)&&(r=n(s,t[e]),-1!==r&&t[e].splice(r,1));return this},e.off=e.removeListener,e.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},e.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},e.manipulateListeners=function(r,t,i){var e,n,s=r?this.removeListener:this.addListener,o=r?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(e=i.length;e--;)s.call(this,t,i[e]);else for(e in t)t.hasOwnProperty(e)&&(n=t[e])&&("function"==typeof n?s.call(this,e,n):o.call(this,e,n));return this},e.removeEvent=function(n){var e,r=typeof n,t=this._getEvents();if("string"===r)delete t[n];else if("object"===r)for(e in t)t.hasOwnProperty(e)&&n.test(e)&&delete t[e];else delete this._events;return this},e.emitEvent=function(r,i){var n,e,s,t=this.getListenersAsObject(r);for(e in t)if(t.hasOwnProperty(e))for(n=t[e].length;n--;)s=i?t[e][n].apply(null,i):t[e][n](),s===!0&&this.removeListener(r,t[e][n]);return this},e.trigger=e.emitEvent,e.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},"function"==typeof define&&define.amd?define(function(){return t}):r.EventEmitter=t}(this);
/* eslint-enable */

/*
 * PDFtoImage
 */

'use strict';

(function (exports) {
	class PdfToImage extends EventEmitter {
		toImages(pdfFile, pagesToPrint = []) {
			if (!pdfFile) {
				throw new Error('No PDF file passed');
			}

			PDFJS.getDocument(pdfFile).then(async pdf => {
				// If no specific pages to print requested, create a sequence `[1..N]`
				pagesToPrint = pagesToPrint.length ?
					pagesToPrint : Array.from(Array(10).keys()).slice(1);

				for (const pageNum of pagesToPrint) {
					await pdf.getPage(pageNum) // eslint-disable-line no-await-in-loop
						.then(this._renderPageOnCanvas.bind(this))
						.then(this._exportCanvasAsBase64.bind(this))
						.then(images => {
							this.emit('page', {pageNum, images});
						});
				}

				this.emit('finish');
			}, err => {
				this.emit('error', {err});
				throw new Error(err);
			});
		}

		_exportCanvasAsBase64(canvas) {
			// A4 page in portrait: 210 x 297
			return {
				original: canvas.toDataURL('image/jpeg'),
				thumbnail: this._resampleCanvas(canvas, 210, 297, true).toDataURL('image/jpeg')
			};
		}

		getNumOfPages(pdfFile) {
			return PDFJS.getDocument(pdfFile).then(pdf => pdf.pdfInfo.numPages);
		}

		_renderPageOnCanvas(page) {
			const scale = 1.5;
			const viewport = page.getViewport(scale);
			const canvas = this._createTempCanvas(viewport.width, viewport.height);
			const ctx = canvas.getContext('2d');

			return page.render({
				canvasContext: ctx,
				viewport
			}).promise.then(() => {
				return canvas;
			});
		}

		/* eslint-disable */
		_resampleCanvas(canvas, width, height, resize_canvas) {
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
											if (data[pos_x + 3] < 255)
													weight = weight * data[pos_x + 3] / 250;
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

		_createTempCanvas(width, height) {
			const canvas = document.createElement('canvas');
			canvas.style.display = 'none';
			canvas.width = width;
			canvas.height = height;

			return canvas;
		}
	}

	exports.PdfToImage = PdfToImage;
})(this);
