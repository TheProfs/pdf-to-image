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
          .then(file => {
            this.emit('page', {pageNum, file: file});
          })
      }

      this.emit('finish');
    }, err => {
      this.emit('error', {err});
      throw new Error(err);
    });
  }

  _base64ToFile(base64) {
    // Testing envs. such as Phantom cannot create neither a Blob nor a File
    try {
      const blob = new Blob([base64], {type:'application/pdf'});

      return new File([blob], "export.pdf");
    } catch (err) {
      // If that's the case, just return the error text
      return err;
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
    return Array.from(Array(max).keys()).slice(1);
  }
}
