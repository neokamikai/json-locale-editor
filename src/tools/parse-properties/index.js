/**
 * 
 * @param {string} content 
 */
module.exports = (content) => {
  const json = {};
  const append = (line) => {
    let tmp = line;
    const hashtagIndex = line.indexOf('#');
    const equalSign = line.indexOf('=');
    const pushKey = (kvp) => {
      const [key, ...value] = kvp.split('=');
      json[key.trim()] = value.join('=').trim();
    };
    if (equalSign !== -1) {
      if (hashtagIndex !== -1) {
        if (equalSign > hashtagIndex) {
          tmp = tmp.substr(0, hashtagIndex);
        }
        else if (equalSign < hashtagIndex) {
          pushKey(tmp);
        }
      }
      else {
        pushKey(tmp);
      }
    }
  };
  content.replace(/[\r\n]/g, '\n')
    .split('\n')
    .forEach(append);
  return json;
};