/* eslint import/no-unassigned-import: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-undef: 0 */

'use strict';

const expect = chai.expect;
const should = chai.should();

describe('PdfToImage', () => {
	describe('Constructor', () => {
		it('Should instantiate', () => {
			const pdfToImage = new PdfToImage();
			expect(pdfToImage).to.be.ok;
		});
	});

	describe('Returns info about the PDF', function () {
		it('Should return the number of pages of the document', () => {
			const pdfToImage = new PdfToImage();

			return pdfToImage.getNumOfPages(window.userPDF).then(numPages => {
				numPages.should.be.a('Number');
				numPages.should.be.above(0);
			})
		})
	});

	describe('Renders PDF pages as images', function () {
		this.timeout(6000);

		it('Should throw if no file is passed in', () => {
			expect(() => {
				(new PdfToImage()).toImages();
			}).to.throw(Error);
		});

		it(`Should emit 'page' events, each event containing a PDF page as an Base64
		 		image string and finally it should emit a 'finish' event`, done => {
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

			pdfToImage.toImages(window.userPDF);
		});
	});
});
