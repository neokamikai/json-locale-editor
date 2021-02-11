class Translator {
  constructor() {
    this.allKeys = [];
    this.allLanguages = [];
    this.translations = {
    }
  }
  encodeKey(key) {
    if (/[´.]/.test(key)) {
      return `´${key.replace(/[´]/g, '´´')}´`;
    }
    return key;
  }
  decodeKey(fullKey) {
    const keys = [];
    let tmp = fullKey;
    while (tmp.length > 0) {
      var quoteIndex = tmp.indexOf('´', -1);
      if (quoteIndex !== -1) {
        var beforeQuoteStr = tmp.substr(0, quoteIndex - (tmp.substr(quoteIndex - 1, 1) === '.' ? 1 : 0));
        var afterQuoteStr = tmp.substr(quoteIndex + 1);

        var dotBeforeQuoteIndex = beforeQuoteStr.indexOf('.', -1);
        var doubleQuoteIndex = afterQuoteStr.indexOf('´´');
        var singleQuoteAfterDoubleQuote = afterQuoteStr.substr(doubleQuoteIndex + 1).indexOf('´');
        if (dotBeforeQuoteIndex !== -1) {
          keys.push(...beforeQuoteStr.split('.'));
        }
        while (doubleQuoteIndex !== -1) {
          doubleQuoteIndex = afterQuoteStr.indexOf('´´', doubleQuoteIndex + 2);
          if (doubleQuoteIndex !== -1) {
            singleQuoteAfterDoubleQuote = afterQuoteStr.indexOf('´', doubleQuoteIndex + 2);
          }
        }
        var quotedString = afterQuoteStr.substr(0, singleQuoteAfterDoubleQuote);
        keys.push(quotedString);
        tmp = afterQuoteStr.substr(quotedString.length + 1).replace(/^[.]/, '');
      }
      else {
        var dotIndex = tmp.indexOf('.');
        if (dotIndex !== -1) {
          keys.push(...tmp.split('.'));
        }
        else {
          keys.push(tmp);
        }
        tmp = '';
      }
    }
    return keys;
  }
  pushKeys(language, data, parents = []) {
    Object.entries(data).forEach(([key, value]) => {
      const fullKey = [...parents, this.encodeKey(key)].join('.');
      if (typeof value === 'string') {
        this.set(language, fullKey, value);
      }
      else {
        this.pushKeys(language, value, [fullKey]);
      }
    });
  }
  set(language, key, value) {
    if (!this.allLanguages.includes(language)) {
      this.allLanguages.push(language);
    }
    const previousValue = this.get(language, key);
    const normalizedValue = [null, undefined].includes(value) ? '' : `${value}`;
    if (!this.allKeys.includes(key)) {
      this.allKeys.push(key);
      this.translations[key] = {};
    }
    this.translations[key][language] = normalizedValue;
    return {
      language,
      key,
      inputValue: value,
      changed: previousValue !== normalizedValue,
      newNormalizedValue: normalizedValue,
      previousValue,
    };
  }
  get(language, key) {
    if (this.allKeys.includes(key) && this.allLanguages.includes(language)) {
      const value = this.translations[key][language];
      if (typeof value === 'string') return value;
      if (![null, undefined].includes(value)) return `${value}`;
    }
    return '';
  }
  output() {
    return this.translations;
  }
  generateCsv() {
    const normalizeValue = (value) => {
      let normalizedValue = value;
      if (/^[+-=]/.test(normalizedValue)) {
        normalizedValue = `'${normalizedValue}`;
      }
      if (normalizedValue.indexOf(',') || normalizedValue.indexOf('"')) {
        normalizedValue = `"${value.replace(/"/g, '""')}"`;
      }
      return normalizedValue;
    };
    const content = [
      ['Keys', ...this.allLanguages],
      ...this.allKeys.map(key => ([
        key, ...this.allLanguages.map(language => this.get(language, key)),
      ])),
    ].map(keys => keys.map(column => normalizeValue(column.replace(/^([+-=])/, '\'$1'))).join(',')).join('\n');
    return content;
  }
  generateJson(language, spacing) {
    const json = {

    };
    const pushFullKey = (fullPathKey) => {
      const keys = this.decodeKey(fullPathKey);
      const value = this.get(language, fullPathKey);
      const lastKey = keys.pop();
      const appendKey = (obj, key, remainingKeys) => {
        if (key === undefined) return obj;
        if (!obj[key]) {
          obj[key] = {};
        }
        if (remainingKeys.length > 0) {
          return appendKey(obj, remainingKeys[0], remainingKeys.slice(1));
        }

        return obj[key];
      };
      const final = appendKey(json, keys[0], keys.slice(1));
      final[lastKey] = value;
    };
    this.allKeys.forEach(pushFullKey);
    return JSON.stringify(json, null, spacing);
  }
}

export default Translator;