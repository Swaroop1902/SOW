const fs = require('fs');
const pdfParse = require('pdf-parse');

// Extracts start and end dates from PDF file
const extractDatesFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Use regex to extract Start Date and End Date
    const text = pdfData.text;
    const startDateMatch = text.match(/Start Date:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
    const endDateMatch = text.match(/End Date:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/);

    const startDate = startDateMatch ? new Date(startDateMatch[1]) : null;
    const endDate = endDateMatch ? new Date(endDateMatch[1]) : null;

    return { startDate, endDate };
  } catch (err) {
    throw new Error('Error parsing PDF: ' + err.message);
  }
};

module.exports = extractDatesFromPDF;
