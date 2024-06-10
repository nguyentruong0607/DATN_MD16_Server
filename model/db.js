const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/DATN_MD16").catch((error) => {
  console.log(error);
});

module.exports = { mongoose }