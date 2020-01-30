/* eslint-disable no-undef */
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

aws.config.update({
  secretAccessKey: process.env.BUCKET_ACCESSKEY,
  accessKeyId: process.env.BUCKET_KEYID,
  region: 'eu-north-1'
})

const createRandomName = (max, originalFileName) => {
  return Math.floor(Math.random() * Math.floor(max)) + originalFileName
}
const s3 = new aws.S3()

const fileFilter = (req, file, callback) => {
  // accept a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    // reject a file
    callback(null, false)
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    key: (req, file, callback) => {
      callback(null, createRandomName(99, file.originalname))
    }
  }),
  limits: { fileSize: 4000000 },
  fileFilter: fileFilter
})

const deleteImage = async (key) => {

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Delete: {
      Objects: [
        {
          Key: key
        }
      ],
      Quiet: false
    }
  }

  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        console.log(err, err.stack)
        reject(true)
      }
      else {
        console.log(data)
        resolve(true)
      }
    })
  })
}

module.exports = { upload, deleteImage }