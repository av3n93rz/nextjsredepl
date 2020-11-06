const express = require('express')
const {protect, admin} = require('../middlewares/authMiddleware')
const multer = require('multer')
const path = require('path')

const router = express.Router()


const storage = multer.diskStorage({
  destination(req, file, cb){
    cb(null, 'public/images/')
  },
  filename( req, file, cb){
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage
})


router.post('/', protect, admin, upload.array('image'), (req, res)=>{
  res.send(req.files)
})

module.exports = router