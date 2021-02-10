class Translator {
  constructor() {
    this.allKeys = [];
    this.allLanguages = [];
    this.translations = {
    }
  }
  pushKeys(language, data, parents = []) {
    if (!this.allLanguages.includes(language)) {
      this.allLanguages.push(language);
    }
    Object.entries(data).forEach(([key, value]) => {
      const fullKey = [...parents, key].join('.');
      if (typeof value === 'string') {
        this.pushKey(language, fullKey, value);
      }
      else {
        this.pushKeys(language, value, [fullKey]);
      }
    });
  }
  pushKey(language, key, value) {
    if (!this.allKeys.includes(key)) {
      this.allKeys.push(key);
      this.translations[key] = {};
    }
    this.translations[key][language] = value;
  }
  output() {
    return this.translations;
  }
}
module.exports = Translator;