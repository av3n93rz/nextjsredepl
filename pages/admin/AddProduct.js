import React, {useState, useEffect} from 'react';
import PrivateRoute from '../../Components/hocs/PrivateRoute';
import getCategoriesAndBrands from '../../Components/hocs/getCategoriesAndBrands';
import axios from 'axios'
import Head from 'next/head'
import Navbar from '../../Components/Navbar'
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
import Router from 'next/router'
import Typography from '@material-ui/core/Typography';

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
  Visibility:{
    display: 'none'
  },
  buttonContainer:{
    display: 'flex',
    justifyContent: 'center'
  },
  ButtonMargin: {
    margin: '0 20px'
  }
}));

const AddProduct = ({userAuth, categories, brands}) => {
  const classes = useStyles();
  const [selectedFiles, setSelectedFiles] = useState([])
  const [reload, setReload] = useState(false)
  const [success, setSuccess] = useState(false)
  const [status, setStatus] = useState({
    info:false,
    message: ""
  })
  const [created, setCreated] = useState("")
  const [product, setProduct] = useState({
    name: "",
    price: undefined,
    category: "",
    newCategory:undefined,
    brand: "",
    newBrand: undefined,
    description: "",
    countInStock: undefined,
  })

  useEffect(()=>{
    if(reload){
      Router.reload(window.location.pathname);
    }
  },[reload])

  const AddAnOtherHandler = () =>{
    setReload(true)
  }

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
      const imagePaths = []
      data.map((item)=> {imagePaths.push(`/images/${item.filename}`)})
      return imagePaths
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
    document.querySelector('form').classList.toggle('makeStyles-Visibility-9')
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
    const {data} = await axios.post(`/api/v1/products/`, productData, config)
    setCreated(data.name)
    setStatus({info: false, message:""})
    setSuccess(true)
    } catch (error) {
      console.error(error)
      document.querySelector('form').classList.toggle('makeStyles-Visibility-9')
    }
  }

return <>
  <Head>
    <title>Add Product</title>
    <meta name="description" content='Add new product and categories to the catalog.' />
  </Head>
  <Navbar User_name={userAuth && userAuth.name}/>
  <Container maxWidth="sm" className={classes.Container}>
    <h1>Add new product</h1>
    {success && <Alert variant="filled" color="success" severity="success" className={classes.infoBar}>{`${created} has been created!`}</Alert>}
    {status.info && <Alert variant="filled" color="info" severity="info" className={classes.infoBar}>{status.message}</Alert>}
    <div className={classes.buttonContainer}>
      {success&& <>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.cardTitle}>Go to </Typography>
        <Link href='/admin/ProductList' underline='none' className={classes.ButtonMargin}><Button variant="contained" color="primary">Product List</Button></Link>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.cardTitle}> or </Typography>
        <Button variant="contained" color="primary" className={classes.ButtonMargin} onClick={AddAnOtherHandler}>Add More Products</Button></>
      }
    </div>
    <form className={classes.form} onSubmit={submitHandler}>
      <TextField required className={classes.inputField} type="text" label="Product name" value={product.name} onChange={(e)=> setProduct({...product, name:e.target.value})}/>
      <TextField required className={classes.inputField} type="number" label="Price" value={product.price} onChange={(e)=> setProduct({...product, price:e.target.value})}/>
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
      <div className={classes.dropzoneContainer}>
      <DropzoneArea onChange={(files) => setSelectedFiles(files)} acceptedFiles={['image/*']} showAlerts={false} filesLimit={6} previewGridClasses={{container:"makeStyles-dropzonePreviewContainer-6", item:"makeStyles-dropzoneImageContainer-5"}}/>
      </div>
      <Button variant="contained" color="primary" type="submit">Add Product</Button>
    </form>    
  </Container>
</>
};

AddProduct.getInitialProps = async ({brands, categories}) => {
  return {brands, categories}
}

export default PrivateRoute(getCategoriesAndBrands(AddProduct));