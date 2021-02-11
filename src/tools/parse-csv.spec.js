const parseCsv = require('./parse-csv');

describe('parseCsv', () => {
  it('should return an array of lines, where each line is an array of strings', () => {
    const input = '"row1col1";"row1col2"\nrow2col1;row2col2\n';
    const expected = [['row1col1', 'row1col2'], ['row2col1', 'row2col2']];
    const result = parseCsv(input);
    expect(result).toEqual(expected);
  });
});