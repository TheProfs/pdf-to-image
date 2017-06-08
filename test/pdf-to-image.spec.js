/* eslint import/no-unassigned-import: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-undef: 0 */

'use strict';

const expect = chai.expect;
const should = chai.should();

/*
 * Utilities
 */

class TickCounter {
	constructor(opts = {expectedTicks: 0}, cb) {
		this._expectedTicks = opts.expectedTicks;
		this._ticks = 0;
		this._cb = cb;
	}

	tick() {
		this._ticks++;
	}

	finish() {
		if (this._ticks === this._expectedTicks) {
			return this._cb();
		}

		return this._cb(new Error(`Ticked ${this._ticks} but expected ${this._expectedTicks}`));
	}
 }

/*
 * Actual Tests
 */

describe('PdfToImage', () => {
	describe('Constructor', () => {
		it('Should instantiate', () => {
			const pdfToImage = new PdfToImage();
			expect(pdfToImage).to.be.ok;
		});
	});

	describe('Returns info about the PDF', () => {
		it('Should return the number of pages of the document', () => {
			const pdfToImage = new PdfToImage();

			return pdfToImage.getNumOfPages(window.userPDF).then(numPages => {
				numPages.should.be.a('Number');
				numPages.should.be.above(0);
			});
		});
	});

	describe('Renders PDF pages as images', function () {
		this.timeout(6000);

		it('Should throw if no file is passed in', () => {
			expect(() => {
				(new PdfToImage()).toImages();
			}).to.throw(Error);
		});

		it(`Should emit 'page' events containing each PDF page's Base64 images,
			both image & thumbnail, then finally it should emit a 'finish' event`, done => {
			const pdfToImage = new PdfToImage();

			pdfToImage.addListener('page', result => {
				result.should.be.an('Object');

				result.should.have.property('pageNum');
				result.should.have.property('images');

				result.pageNum.should.be.a('Number');
				result.pageNum.should.be.above(0);

				result.images.should.have.property('original');
				result.images.should.have.property('thumbnail');

				result.images.original.should.be.a('String');
				result.images.original.should.have.length.above(200);

				result.images.thumbnail.should.be.a('String');
				result.images.thumbnail.should.have.length.above(200);

				result.images.thumbnail.length.should.be.lessThan(result.images.original.length);

				const original = new Image();
				original.src = result.images.original;
				document.getElementById('result-container').appendChild(original);
			});

			pdfToImage.addListener('finish', done);

			pdfToImage.toImages(window.userPDF);
		});

		it(`Should render only specified pages when provided with an Array
				containing the required page numbers`, done => {
			const pdfToImage = new PdfToImage();
			const pagesToPrint = [1];
			const tickCounter = new TickCounter({
				expectedTicks: pagesToPrint.length
			}, done);

			pdfToImage.addListener('page', () => tickCounter.tick());
			pdfToImage.addListener('finish', () => tickCounter.finish());

			pdfToImage.toImages(window.userPDF, pagesToPrint);
		});
	});
});
