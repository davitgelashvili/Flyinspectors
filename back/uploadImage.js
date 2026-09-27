// backend/upload.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dkcr1v0dl', 
  api_key: '417253437375566', 
  api_secret: 'aeMyzo84dWEkdkHlAYce4gCSNxU'
});

const uploadImageAsync = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'new_users',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

module.exports = { uploadImageAsync };


// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: 'dkcr1v0dl', 
//   api_key: '417253437375566', 
//   api_secret: 'aeMyzo84dWEkdkHlAYce4gCSNxU'
// });

// // Async/Await Approach
// const uploadImageAsync = async (file) => {
//   try {
//     const result = await cloudinary.uploader.upload(file, {
//       folder: 'new_users', // Optional, specify a folder for the image
//     });
//     return result.secure_url; // URL of the uploaded image
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     throw error;
//   }
// };

// // Promise-based approach for multiple uploads
// const uploadMultipleImages = (images) => {
//   const opts = {
//     overwrite: true,
//     invalidate: true,
//     resource_type: "auto", // Automatically detects the resource type (image, video, etc.)
//   };

//   return new Promise((resolve, reject) => {
//     const uploads = images.map((image) => {
//       return new Promise((resolveImage, rejectImage) => {
//         cloudinary.uploader.upload(image, opts, (error, result) => {
//           if (result && result.secure_url) {
//             console.log(result.secure_url);
//             return resolveImage(result.secure_url);
//           }
//           console.log(error.message);
//           return rejectImage({ message: error.message });
//         });
//       });
//     });

//     Promise.all(uploads)
//       .then((values) => resolve(values)) // Resolve when all images are uploaded
//       .catch((err) => reject(err)); // Reject if any image fails to upload
//   });
// };

// // Exporting for external usage
// module.exports = {
//   uploadImageAsync,
//   uploadMultipleImages
// };



// const cloudinary = require('cloudinary').v2;

// cloudinary.config({ 
//     cloud_name: 'dkcr1v0dl', 
//     api_key: '417253437375566', 
//     api_secret: 'aeMyzo84dWEkdkHlAYce4gCSNxU'
//   });

//   const opts = {
//     overwrite: true,
//     invalidate: true,
//     resource_type: "auto",
//   };
  
//   const uploadImage = (image) => {
//     //imgage = > base64
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload(image, opts, (error, result) => {
//         if (result && result.secure_url) {
//           console.log(result.secure_url);
//           return resolve(result.secure_url);
//         }
//         console.log(error.message);
//         return reject({ message: error.message });
//       });
//     });
//   };
//   module.exports = (image) => {
//     //imgage = > base64
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload(image, opts, (error, result) => {
//         if (result && result.secure_url) {
//           console.log(result.secure_url);
//           return resolve(result.secure_url);
//         }
//         console.log(error.message);
//         return reject({ message: error.message });
//       });
//     });
//   };
  
//   module.exports.uploadMultipleImages = (images) => {
//     return new Promise((resolve, reject) => {
//       const uploads = images.map((base) => uploadImage(base));
//       Promise.all(uploads)
//         .then((values) => resolve(values))
//         .catch((err) => reject(err));
//     });
//   };