module.exports = function relaxedCheck(str) {
  var chars = { "{": "}", "(": ")", "[": "]" };
  if (str[0] === "!") {
    return true;
  }
  var index = 0;
  while (index < str.length) {
    if (/[*?{}()[\]]/.test(str[index])) {
      return true;
    }

    if (str[index] === "\\") {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) {
          index = n + 1;
        }
      }

      if (str[index] === "!") {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};
