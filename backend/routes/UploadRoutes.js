const express = require('express')
const {protect, admin} = require('../middlewares/authMiddleware')
const multer = require('multer')
const {readImg} = require('../Controllers/imageKit')
const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({
  storage
})

router.post('/', protect, admin, upload.array('image'), async(req, res)=>{
  let urls =[]
  for(file in req.files){
    const imgurl = await readImg(req.files[file].buffer.toString('base64'))
    urls.push({url: imgurl.url, fileId: imgurl.fileId})
  }
  res.send(urls)
})

module.exports = router