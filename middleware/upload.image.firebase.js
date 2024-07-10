const { admin } = require('./firebase.config');

const uploadImage = async (file,folderName) => {
  return new Promise((resolve, reject) => {
    const bucket = admin.storage().bucket();
    const fileName = `${folderName}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      predefinedAcl: 'publicRead', 
    });

    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', () => {
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      resolve(imageUrl);
    });

    blobStream.end(file.buffer);
  });
};

const deleteImage = async (imageUrl) => {
  const bucket = admin.storage().bucket();
  const fileName = imageUrl.replace(`https://storage.googleapis.com/${bucket.name}/`, '');

  try {
    await bucket.file(fileName).delete();
    console.log(`Image deleted successfully: ${fileName}`);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

module.exports = { uploadImage ,deleteImage};