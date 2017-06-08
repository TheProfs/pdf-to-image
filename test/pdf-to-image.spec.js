'use strict';

// Temporary sanity test for TravisCI

describe('solve do x', function() {
	it('shoud do x', function(done) {
		done();
	})
})


describe('solve for y', function() {
	this.timeout('5000');

	it('shoud solve for x', function(done) {
		var pdf = new PdfToImage();
		pdf.toImages('test.pdf')
		done()
	})
})
