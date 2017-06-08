/* eslint unicorn/no-abusive-eslint-disable: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-undef: 0 */

/*
 * PDFtoImage
 */

'use strict';

class PdfToImage extends EventEmitter { // eslint-disable-line no-unused-vars

	toImages(pdfFile, pages = []) {
		if (!pdfFile) {
			throw new Error('No PDF file passed');
		}

		PDFJS.getDocument(pdfFile).then(async pdf => {
			pages = pages.length ? pages : this._createSequence(pdf.pdfInfo.numPages);

			for (const pageNum of pages) {
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
	// Taken from: https://stackoverflow.com/a/18320662/1814486
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

	_createSequence(max) {
		return Array.from(Array(max).keys()).slice(1);
	}
}
