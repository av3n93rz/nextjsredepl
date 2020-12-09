const express = require('express')
const {protect, admin} = require('../middlewares/authMiddleware')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')
const excelToJson = require('convert-excel-to-json');

const storage = multer.memoryStorage();
const upload = multer({
  storage
})

router.post('/', protect, admin, upload.single('file'), async(req, res)=>{
  console.log(req.file)
  const result = excelToJson({
    source: req.file.buffer,
    header:{
	    rows: 1
	  },
    columnToKey: {
      A: '{{A1}}',
      B: '{{B1}}',
      C: '{{C1}}',
      D: '{{D1}}',
      E: '{{E1}}',
      F: '{{F1}}',
    }
  });
  res.send(result)
})

module.exports = router