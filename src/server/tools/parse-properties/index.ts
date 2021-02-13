/**
 *
 * @param content
 */
export default (content: string) => {
  const json: { [id: string]: string } = {};
  const append = (line: string) => {
    let tmp = line;
    const hashtagIndex = line.indexOf('#');
    const equalSign = line.indexOf('=');
    const pushKey = (keyValuePairStr: string) => {
      const [key, ...value] = keyValuePairStr.split('=');
      json[key.trim()] = value.join('=').trim();
    };
    if (equalSign !== -1) {
      if (hashtagIndex !== -1) {
        if (equalSign > hashtagIndex) {
          tmp = tmp.substr(0, hashtagIndex);
        } else if (equalSign < hashtagIndex) {
          pushKey(tmp);
        }
      } else {
        pushKey(tmp);
      }
    }
  };
  content.replace(/[\r\n]/g, '\n')
    .split('\n')
    .forEach(append);
  return json;
};
