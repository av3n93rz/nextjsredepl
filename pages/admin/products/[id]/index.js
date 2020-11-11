import React, {useState, useEffect} from 'react';
import PrivateRoute from '../../../../Components/hocs/PrivateRoute';
import getCategoriesAndBrands from '../../../../Components/hocs/getCategoriesAndBrands';
import axios from 'axios'
import Head from 'next/head'
import Navbar from '../../../../Components/Navbar'
import {Container} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import {DropzoneArea} from 'material-ui-dropzone'
import Typography from '@material-ui/core/Typography';
import Image from 'next/image'
import GetProduct from '../../../../Components/hocs/GetProduct'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputField:{
    margin: '10px 0'
  },
  dropzoneContainer:{
    margin: '20px 0'
  },
  formControl:{
    margin: '10px 0'
  },
  dropzoneImageContainer:{
    padding:'unset !important',
    margin: '20px',
    '& button':{
      top: '0px !important',
      right: '0px !important'
    }
  },
  dropzonePreviewContainer:{
    width:'unset !important',
    margin: 'unset',
    justifyContent: 'center'
  },
  infoBar:{
    margin:'10px 0',
    marginBottom: '25px'
  },
  Container:{
    marginTop: '50px',
    marginBottom: '50px',
  },
  buttonContainer:{
    display: 'flex',
    justifyContent: 'center'
  },
  ButtonMargin: {
    margin: '0 20px'
  },
  existingImgs:{
    maxWidth: '250px',
    maxHeight: '-webkit-fill-available'
  },
  ImgPaper:{
    maxHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px',
    paddingTop: '16px',
    position: 'relative',
    '&:hover':{
      '& button':{
        opacity: '1'
      }
    }
  },
  delFab:{
    width: '40px',
    height:'40px',
    position: 'absolute',
    top: '10px',
    right: '10px',
    opacity: '0'
  },
  saleContainer:{
    display: 'flex'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const EditProduct = ({userAuth, categories, brands, productObj}) => {
  const classes = useStyles();
  const [selectedFiles, setSelectedFiles] = useState([])
  const [success, setSuccess] = useState(false)
  const [status, setStatus] = useState({
    info:false,
    message: ""
  })
  const [product, setProduct] = useState({
    name: productObj.name,
    image: productObj.image,
    price: productObj.price,
    category: productObj.category._id,
    newCategory:undefined,
    brand: productObj.brand._id,
    newBrand: undefined,
    discount: productObj.discount,
    discountPrice: productObj.discountPrice,
    description: productObj.description,
    countInStock: productObj.countInStock,
  })
  const [created, setCreated] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: undefined
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    target: undefined
  });

  const handleClickOpen = (img) => {
    setDeleteDialog({open: true, target:img});
  };
  const handleClose = () => {
    setDeleteDialog({open:false, target: undefined});
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }

  const uploadFileHandler = async () =>{
    setStatus({info: true, message:"Uploading images..."})
    const formData = new FormData()
    selectedFiles.forEach(item => {
      formData.append('image', item)
    })
    try {
      const config = {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      }
      const {data} = await axios.post('/api/v1/upload', formData, config)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const createNewCategory = async () =>{
    setStatus({info: true, message:"Creating new category..."})
    try {
      const config = {
        headers: {
          'Content-Type':'application/json',
        }
      }
      const {data} = await axios.post(`/api/v1/categories/`, { name:product.newCategory}, config)
      return data._id
      } catch (error) {
        console.error(error)
      }
  }

  const createNewBrand = async () =>{
    setStatus({info: true, message:"Creating new brand..."})
    try {
      const config = {
        headers: {
          'Content-Type':'application/json',
        }
      }
      const {data} = await axios.post(`/api/v1/brands/`, { name:product.newBrand}, config)
      return data._id
      } catch (error) {
        console.error(error)
      }
  }

  const submitHandler = async (e) =>{
    e.preventDefault()
    document.querySelector('form').style.display = 'none'
    scrollToTop()
    let images
    let newBrandId
    let newCategoryId
    if(selectedFiles.length > 0){
      images = await uploadFileHandler()
    }
    if(product.category === "Add New Category"){
      newCategoryId = await createNewCategory()
    }
    if(product.brand === "Add New Brand"){
      newBrandId = await createNewBrand()
    }
    try {
    setStatus({info: true, message:"Uploading product data..."})
    const config = {
      headers: {
        'Content-Type':'application/json',
      }
    }
    let productData = {...product, images, newBrandId, newCategoryId}
    const {data} = await axios.put(`/api/v1/products/${productObj._id}`, productData, config)
    setCreated(data.name)
    setStatus({info: false, message:""})
    setSuccess(true)
    } catch (error) {
      console.error(error)
      document.querySelector('form').style.display = 'flex'
    }
  }

  const searchRequestHandler = (searchValue, category) => {
    console.log(searchValue, category)
  }

  const handleCheck = () =>{
    setProduct({...product, discount: !product.discount})
  }

  const deleteImage = async (target) =>{
    handleClose()
      try {
            await axios.delete(`/api/v1/deleteFromCDN/${target.fileId}`,)
          }
      catch (error) {
        setSnackbar({open: true, msg:error.response.data.error.message})
        console.error(error)
      }
      
      let images = product.image
      images.splice(images.indexOf(target), 1)
      setProduct({...product, image:images})
      try{
        const config = {
          headers: {
            'Content-Type':'application/json',
          }
        }
        await axios.put(`/api/v1/products/${productObj._id}`, {...product}, config)
        setSnackbar({open: true, msg:'The image has been deleted'})
      }
      catch (error) {
        setSnackbar({open: true, msg:error.message})
      }
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({open: false, msg: undefined});
  };

  const action = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnack}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

return <>
  <Head>
    <title>Edit {product.name}</title>
    <meta name="description" content='Edit products in the catalog' />
  </Head>
  <Navbar user={userAuth && userAuth} trigger={searchRequestHandler}/>
  <Container maxWidth="sm" className={classes.Container}>
    <h1>Edit {product.name}</h1>
    <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnack} message={snackbar.msg} action={action}/>
    {success && <Alert variant="filled" color="success" severity="success" className={classes.infoBar}>{`${created} has been created!`}</Alert>}
    {status.info && <Alert variant="filled" color="info" severity="info" className={classes.infoBar}>{status.message}</Alert>}
    <div className={classes.buttonContainer}>
      {success&& <>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.cardTitle}>Go to </Typography>
        <Link href='/admin/products/ProductList' underline='none' className={classes.ButtonMargin}><Button variant="contained" color="primary">Product List</Button></Link>
        </>
      }
    </div>
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={deleteDialog.open}>
        <MuiDialogContent dividers>
          <Typography gutterBottom>
          Are you sure you want to delete this image?
          </Typography>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button autoFocus onClick={()=>deleteImage(deleteDialog.target)} color="primary">
            Delete
          </Button>
        </MuiDialogActions>
      </Dialog>
    <form className={classes.form} onSubmit={submitHandler}>
      <TextField required className={classes.inputField} type="text" label="Product name" value={product.name} onChange={(e)=> setProduct({...product, name:e.target.value})}/>
      <TextField required className={classes.inputField} type="number" label="Price" value={product.price} onChange={(e)=> setProduct({...product, price:e.target.value})}/>
      <div className={classes.saleContainer}>
        <input type='checkbox' id='sale' name='sale' checked={product.discount} onChange={()=>handleCheck()}/>
        <label htmlFor='sale'>
          <Typography variant="subtitle2" color="textSecondary" component="p">
            On sale
          </Typography>
        </label>
      </div>
      {product.discount && <TextField required className={classes.inputField} type="number" label="Discount Price" value={product.discountPrice} onChange={(e)=> setProduct({...product, discountPrice:e.target.value})}/>}
      <TextField required multiline={true} className={classes.inputField} type="text" label="Description" value={product.description} onChange={(e)=> setProduct({...product, description:e.target.value})}/>
      <FormControl required className={classes.formControl}>
        <InputLabel id="select-category-label">Category</InputLabel>
        <Select
          labelId="select-category-label"
          id="select-category"
          value={product.category}
          onChange={(e)=> setProduct({...product, category:e.target.value})}>
          <MenuItem key={"add_new_category"} value={"Add New Category"}>Add New Category</MenuItem>
          {categories.map((category)=>(<MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>))}
        </Select>
      </FormControl>
      {product.category === "Add New Category" && <TextField required className={classes.inputField} inputProps={{ maxLength: 32 }} type="text" label="New Category's name" value={product.newCategory} onChange={(e)=> setProduct({...product, newCategory:e.target.value})}/>}
      <FormControl required className={classes.formControl}>
        <InputLabel id="select-brand-label">Brand</InputLabel>
        <Select
          labelId="select-brand-label"
          id="select-brand"
          value={product.brand}
          onChange={(e)=> setProduct({...product, brand:e.target.value})}>
          <MenuItem key={"add_new_brand"} value={"Add New Brand"}>Add New Brand</MenuItem>
          {brands.map((brand)=>(<MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>))}
        </Select>
      </FormControl>
      {product.brand === "Add New Brand" && <TextField required className={classes.inputField} inputProps={{ maxLength: 32 }} type="text" label="New Brands's name" value={product.newBrand} onChange={(e)=> setProduct({...product, newBrand:e.target.value})}/>}
      <TextField required className={classes.inputField} type="number" label="Count In Stock" value={product.countInStock} onChange={(e)=> setProduct({...product, countInStock:e.target.value})}/>
      <div>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          {product.image.map((img) => (
            <Grid item key={img.fileId}>
              <Paper className={classes.ImgPaper}>
                <Link href={img.url} underline='none'>
                  <Image src={img.url} alt={product.name} unsized={true} className={classes.existingImgs}/>
                </Link>
                <Fab className={classes.delFab} onClick={() =>handleClickOpen(img)}>
                  <DeleteIcon/>
                </Fab>
              </Paper>
            </Grid>
            ))}
        </Grid>
      </Grid>
      </div>
      <div className={classes.dropzoneContainer}>
      <DropzoneArea onChange={(files) => setSelectedFiles(files)} acceptedFiles={['image/*']} showAlerts={false} maxFileSize={10000000} filesLimit={6} previewGridClasses={{container:"makeStyles-dropzonePreviewContainer-6", item:"makeStyles-dropzoneImageContainer-5"}}/>
      </div>
      <Button variant="contained" color="primary" type="submit">Update Product</Button>
    </form>    
  </Container>
</>
};

EditProduct.getInitialProps = async ({brands, categories, product}) => {
  const productObj = product
  return {brands, categories, productObj}
}
export default PrivateRoute(GetProduct(getCategoriesAndBrands(EditProduct)));