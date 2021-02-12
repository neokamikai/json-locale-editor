const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {string} content 
 */
module.exports = async (content) => {
  const wb = new ExcelJS.Workbook();
  const tmpdir = fs.mkdtempSync(`csv_${Date.now()}`);
  const tmpfile = path.join(tmpdir, 'tmp.csv');
  fs.writeFileSync(tmpfile, content, { encoding: 'utf-8' });
  const sheet = await wb.csv.readFile(tmpfile, {
    map : (value) => {
      return [undefined, null].includes(value)?'': `${value}`.replace(/^[']([+-=])/, '$1');
    },
  });
  
  const rowValues = await sheet.getSheetValues();
  fs.rmSync(tmpdir, { recursive: true, force: true });
  return rowValues.slice(1).map(columns => columns.slice(1));
  /*
   * 
   const parseLine = (line) => {
     var tmp = line;
     var columns = [];
     while (tmp.length > 0) {
       var quoteIndex = tmp.indexOf('"', -1);
       if (quoteIndex !== -1) {
         var beforeQuoteStr = tmp.substr(0, quoteIndex - (tmp.substr(quoteIndex - 1, 1) === ',' ? 1 : 0));
         var afterQuoteStr = tmp.substr(quoteIndex + 1);
 
         var commaBeforeQuoteIndex = beforeQuoteStr.indexOf(',', -1);
         var doubleQuoteIndex = afterQuoteStr.indexOf('""');
         var singleQuoteAfterDoubleQuote = afterQuoteStr.substr(doubleQuoteIndex + 1).indexOf('"');
         if (commaBeforeQuoteIndex !== -1) {
           columns.push(...beforeQuoteStr.split(','));
         }
         while (doubleQuoteIndex !== -1) {
           doubleQuoteIndex = afterQuoteStr.indexOf('""', doubleQuoteIndex + 2);
           if(doubleQuoteIndex !== -1){
             singleQuoteAfterDoubleQuote = afterQuoteStr.indexOf('"', doubleQuoteIndex + 2);
           }
         }
         var quotedString = afterQuoteStr.substr(0, singleQuoteAfterDoubleQuote);
         columns.push(quotedString);
         tmp = afterQuoteStr.substr(quotedString.length + 1).replace(/^[,]/, '');
       }
       else {
         var commaIndex = tmp.indexOf(',');
         if (commaIndex !== -1) {
           columns.push(...tmp.split(','));
         }
         else {
           columns.push(tmp);
         }
         tmp = '';
       }
     };
     return columns.map(column => column.replace(/^[']([+-=])/, '$1'))
   };
   const lines = content
     .replace(/\r/g, '')
     .split(/\n/)
     .reduce((previousLines, line) => {
       if (line.length === 0) return previousLines;
       return [
         ...previousLines,
         parseLine(line),
       ];
     }, []);
   return lines;
   */
};