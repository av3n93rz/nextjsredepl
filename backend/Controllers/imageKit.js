const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey : "public_NIgiENDcwRcldcqTvAhgfYoksmU=",
  privateKey : "private_pQDEscKzdfHjKxkt6Zn7IbRC0EU=",
  urlEndpoint : "https://ik.imagekit.io/yy12fco4k5/"
});

exports.readImg = (image) =>{
  return new Promise(function(resolve, reject){
    imagekit.upload({
      file : image, //required
      fileName : "AvisProShop", //required
      useUniqueFileName: true,
    }, function(error, result) {
      if(error) reject(error);
      else resolve(result);
    })
})}

exports.deleteFromCDN = (req, res) =>{
  const fileId = req.params.id
  console.log(fileId)
  imagekit.deleteFile(fileId, function(error, result) {
    if(error){
      res.status(404).json({error})
    }
    else{
      res.status(204).json({
        message: 'Image removed',
        success: true
      })
    };
  });
}


