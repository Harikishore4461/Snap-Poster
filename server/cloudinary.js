const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: "djj09fjos",
  api_key: "918992999365573",
  api_secret: "CSpbGsHm2EGRqjtSG4SmHGa8oaU",
});

module.exports = {cloudinary};