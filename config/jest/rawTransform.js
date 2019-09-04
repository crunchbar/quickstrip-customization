'use strict';

const rawLoader = require('raw-loader');

module.exports = {
  process(src) {
    return rawLoader(src);
  },
};
