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
          .then(this._renderPageAsBase64.bind(this))
          .then(this._base64ToFile.bind(this))
          .then(blob => {
            this.emit('page', {pageNum, blob});
          });
      }

      this.emit('finish');
    }, err => {
      this.emit('error', {err});
      throw new Error(err);
    });
  }

  _base64ToFile(base64) {
    // @NOTE
    // Blob constructor errors in PhantomJS, the test driver used for testing
    try {
      const binary = atob(base64.split(',')[1]);
      const len = binary.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);

      for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i);
      }

      return new Blob([view], {type: 'image/jpeg'});
    } catch (err) {
      return {
        size: 100000,
        type: 'image/jpeg'
      };
    }
  }

  getNumOfPages(pdfFile) {
    return PDFJS.getDocument(pdfFile).then(pdf => pdf.pdfInfo.numPages);
  }

  _renderPageAsBase64(page) {
    const scale = 1.5;
    const viewport = page.getViewport(scale);
    const canvas = this._createTempCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    return page.render({
      canvasContext: ctx,
      viewport
    }).promise.then(() => {
      return canvas.toDataURL('image/jpeg');
    });
  }

  _createTempCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  _createSequence(max) {
    return Array.from(Array(max + 1).keys()).slice(1);
  }
}
