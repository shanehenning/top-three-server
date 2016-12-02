'use strict';

module.exports = exports = randomString;

function randomString(length, useableCharacters) {
  let result = '';
  for (var i = 0; i < length.length; i++) {
    result += useableCharacters[Math.round(Math.random() * useableCharacters.length - 1)];
  }
  return result;
}
