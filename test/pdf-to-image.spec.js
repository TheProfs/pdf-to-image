/*
 * @NOTE: Write the tests in ES5 since the headless environmnent
 * doesn't support ES6.
 *
 * If you accidentaly write ES6 code, you will get the error message
 * 'mocha.run() was called with no tests' when running `$ npm test`
 */

'use strict';

var expect = chai.expect;
var should = chai.should();

/*
 * Utilities
 */

 var TickCounter = function(opts, cb) {
	 this._expectedTicks = opts.expectedTicks;
	 this._ticks = 0;
	 this._cb = cb;

   this.tick = function() {
		 this._ticks++;
	 }

	 this.finish = function() {
		 var err = new Error('Ticked '+ this._ticks + ' but expected ' + this._expectedTicks);
		 return this._cb(this._ticks === this._expectedTicks ? false : err);
	 }
 }

/*
 * Actual Tests
 */

describe('constructor', function() {
	it('Should instantiate', function() {
		var pdfToImage = new PdfToImage();
		expect(pdfToImage).to.be.ok;
	});
});

describe('Returns info about the PDF', function() {
	it('Should return the number of pages of the document', function() {
		var pdfToImage = new PdfToImage();

		return pdfToImage.getNumOfPages('test-data/gal-trace-spliced.pdf').then(function(numPages) {
			numPages.should.be.a('Number');
			numPages.should.be.above(0);
		});
	});
});

describe('Renders PDF pages as images', function() {
	this.timeout(6000);

	it('Should throw if no file is passed in', function() {
		expect(function() {
			(new PdfToImage()).toImages();
		}).to.throw(Error);
	});

	it('Should emit "page" events with images and finally emit a "finish" event', function(done) {
		var pdfToImage = new PdfToImage();

		pdfToImage.addListener('page', function(result) {
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
		});

		pdfToImage.addListener('finish', function() {
			done();
		});

		pdfToImage.toImages('test-data/gal-trace-spliced.pdf');
	});

	it('Should render only specified pages if passed the required page numbers', function(done) {
		var pdfToImage = new PdfToImage();
		var pagesToPrint = [1, 4];
		var tickCounter = new TickCounter({
			expectedTicks: pagesToPrint.length
		}, done);

		pdfToImage.addListener('page', function() {
			tickCounter.tick();
		});

		pdfToImage.addListener('finish', function() {
			tickCounter.finish();
		});

		pdfToImage.toImages('test-data/gal-trace-spliced.pdf', pagesToPrint);
	});
});
