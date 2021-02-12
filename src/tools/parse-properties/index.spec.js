const parser = require('.');

describe('parseProperties', () => {
  it('should parse .properties file into a json object', () => {
    
    const content = '#test\nkey=value';
    const expectedResult = {key: 'value'};
    const result = parser(content);
    expect();
  });
});