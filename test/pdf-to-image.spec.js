/* eslint import/no-unassigned-import: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-undef: 0 */

'use strict';

const expect = chai.expect;
const should = chai.should();

describe('PdfToImage', () => {
	describe('constructor', () => {
		it('should instantiate', () => {
			const pdfToImage = new PdfToImage();
			expect(pdfToImage).to.be.ok;
		});
	});

	describe('Renders PDF pages as images', function () {
		this.timeout(6000);

		it('should throw if no file is passed in', () => {
			expect(() => {
				(new PdfToImage()).toImages();
			}).to.throw(Error);
		});

		it(`should emit 'page' events, each event containing a PDF page as an image
				and finally it should emit a 'finish' event`, done => {
			const testData = {
				file: window.userPDF
			};

			const pdfToImage = new PdfToImage();

			pdfToImage.addListener('page', result => {
				result.should.be.an('Object');
				result.should.have.property('dataURI');
				result.dataURI.should.be.a('String');
				result.dataURI.should.have.length.above(200);

				const image = new Image();
				image.src = result.dataURI;
				document.getElementById('result-container').appendChild(image);
			});

			pdfToImage.addListener('finish', done);

			pdfToImage.toImages(testData.file);
		});
	});
});
