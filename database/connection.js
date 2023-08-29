const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/blog';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectarse a MongoDB:', error);
  }
};

module.exports = connectDB;

