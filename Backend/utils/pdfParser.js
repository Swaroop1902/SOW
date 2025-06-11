
const fs = require('fs');
const pdfParse = require('pdf-parse');

const patterns = [
  {
    type: 'Type1',
    start: /Start Date:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/,
    end: /End Date:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/
  },
  {
    type: 'Type2',
    start: /Start:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/,
    end: /End:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/
  },
  {
    type: 'Type3',
    start: /From\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/,
    end: /To\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/
  },
  {
    type: 'Type4',
    start: /Start Date:\s*([A-Za-z]+\s+\d{1,2})\s*(?:st|nd|rd|th)?\s+(\d{4})/,
    end: /End Date:\s*([A-Za-z]+\s+\d{1,2})\s*(?:st|nd|rd|th)?\s+(\d{4})/
  },
  {
    type: 'Type5',
    start: /start date.*?on\s*([0-9]{2}\s[0-9]{2},\s[0-9]{4})/i,
    end: /through\s*([0-9]{2}\s[0-9]{2},\s[0-9]{4})/i
  }
];

const extractDatesFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.replace(/[\r\n]+/g, ' ');

    for (const pattern of patterns) {
      const startMatch = text.match(pattern.start);
      const endMatch = text.match(pattern.end);

      if (startMatch && endMatch) {
        let startDate, endDate;

        if (pattern.type === 'Type2') {
          const [d1, m1, y1] = startMatch[1].split('/');
          const [d2, m2, y2] = endMatch[1].split('/');
          startDate = new Date(`${y1}-${m1}-${d1}`);
          endDate = new Date(`${y2}-${m2}-${d2}`);
        } else if (pattern.type === 'Type4') {
          const start = `${startMatch[1]} ${startMatch[2]}`;
          const end = `${endMatch[1]} ${endMatch[2]}`;
          startDate = new Date(start);
          endDate = new Date(end);
        } else if (pattern.type === 'Type5') {
          const [m1, d1, y1] = startMatch[1].replace(',', '').split(/\s+/);
          const [m2, d2, y2] = endMatch[1].replace(',', '').split(/\s+/);
          startDate = new Date(`${y1}-${m1}-${d1}`);
          endDate = new Date(`${y2}-${m2}-${d2}`);
        } else {
          startDate = new Date(startMatch[1]);
          endDate = new Date(endMatch[1]);
        }

        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        return { startDate, endDate, extractionType: pattern.type };
      }
    }

    return { startDate: null, endDate: null, extractionType: null };
  } catch (err) {
    throw new Error('Error parsing PDF: ' + err.message);
  }
};

module.exports = extractDatesFromPDF;
