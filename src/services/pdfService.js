const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');
const { checklistSchema, sectionLabels } = require('../data/inspectionCategories');

class PDFService {
  static async generateInspectionReportPDF(reportData) {
    const templatePath = path.join(__dirname, '../view/templates/reportTemplate.ejs');

    const renderedHTML = await ejs.renderFile(templatePath, {
      ...reportData,
      checklistSchema,
      sectionLabels,
      scoreColor: this.getScoreColor(reportData.report.hygiene_score)
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setContent(renderedHTML, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '10mm',
          bottom: '20mm',
          left: '10mm'
        },
        printBackground: true
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  static getScoreColor(score) {
    return score >= 4 ? 'green' : score >= 3 ? 'orange' : 'red';
  }
}

module.exports = PDFService;