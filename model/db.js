const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://root:12345@cluster0.iko3pjs.mongodb.net/', {
    });
    console.log('Kết nối thành công đến MongoDB');
  } catch (error) {
    console.error('Lỗi kết nối đến MongoDB:', error);
  }
};

module.exports = connectDB;