import React, {useState, useEffect} from 'react';
import PrivateRoute from '../../../Components/hocs/PrivateRoute';
import getCategoriesAndBrands from '../../../Components/hocs/getCategoriesAndBrands';
import axios from 'axios'
import Head from 'next/head'
import Navbar from '../../../Components/Navbar'
import {Container} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/core/Alert';
import Input from '@material-ui/core/Input';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
  paper:{
    padding: '15px'
  },
  inputs:{
    paddingLeft:'15px',
    paddingRight:'15px',
    '& label':{
      paddingLeft:'15px',
      paddingRight:'15px',
    }
  },
  inputs2ndRow:{
    display: 'flex',
    marginTop: '10px',
    marginBottom: '10px',
    '&>div':{
      width:'100%'
    }
  },
  description:{
    width:'100%',
    paddingLeft:'15px',
    paddingRight:'15px',
    '& label':{
      paddingLeft:'15px',
      paddingRight:'15px',
    }
  },
  selects_container:{
    marginTop:'10px',
    display: 'flex',
    '&>div':{
      width:'100%',
      marginLeft:'15px',
      marginRight:'15px',
    }
  },
  selects:{
    marginTop: '16px'
  }
}));

const AddProduct = ({userAuth, categories, brands}) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState('')
  const [reload, setReload] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [status, setStatus] = useState({
    info:false,
    message: ""
  })
  const [uploadedObject, setUploadedObject] = useState(false)
  const [products, setProducts] = useState(false)

  useEffect(()=>{
    if(uploaded === true && uploadedObject != false){
      let updatedObject = uploadedObject
      Object.keys(uploadedObject).map((key)=>{uploadedObject[key].map((item, index)=>{
        let c_id
        let b_id
        categories.map((category)=>{
          if(item.category.toLowerCase() === category.name.toLowerCase()){
            c_id = category._id
          }
        })
        brands.map((brand)=>{
          if(item.brand.toLowerCase() === brand.name.toLowerCase()){
            b_id = brand._id
          }
        })
        updatedObject[key][index].category = c_id?c_id:'Add New Category'
        updatedObject[key][index].brand = b_id?b_id:'Add New Brand'
      })})
      setUploaded(false)
      setProducts({...updatedObject})
    }
  },[uploaded, uploadedObject])

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

  const createNewCategory = async (name) =>{
    setStatus({info: true, message:"Creating new category..."})
    try {
      const config = {
        headers: {
          'Content-Type':'application/json',
        }
      }
      const {data} = await axios.post(`/api/v1/categories/`, {name}, config)
      return data._id
      } catch (error) {
        console.error(error)
      }
  }

  const createNewBrand = async (name) =>{
    setStatus({info: true, message:"Creating new brand..."})
    try {
      const config = {
        headers: {
          'Content-Type':'application/json',
        }
      }
      const {data} = await axios.post(`/api/v1/brands/`, {name}, config)
      return data._id
      } catch (error) {
        console.error(error)
      }
  }

  const upload_prods_Handler = async (e) =>{
    e.preventDefault()
    Object.keys(products).map((key)=>{products[key].map(async (item, index)=>{
        if(item.category === 'Add New Category'){
          const id = await createNewCategory(item.newCategory)
          products[key][index].category = id
        }
        if(item.brand === 'Add New Brand'){
          const id = await createNewBrand(item.newBrand)
          products[key][index].brand = id
        }
  })})
    console.log(products)
  }

  const submitHandler = async (e) =>{
    e.preventDefault()
    try {
      setStatus({info: true, message:"Uploading file..."})
      const config = {
        headers: {
          'Content-Type':'multipart/form-data',
        }
      }
      const formData = new FormData()
      formData.append('file', selectedFile)
      const {data} = await axios.post(`/api/v1/uploadxml/`, formData, config)
      setUploadedObject(data)
      setStatus({info: false, message:""})
      setUploaded(true)
      } catch (error) {
        console.error(error)
      }
  }

  const passToBottom = () =>{
    return
  }

  const searchRequestHandler = (searchValue, category) => {
    console.log(searchValue, category)
  }

  const changeProductDetail = (e, i, key, field) => {
    let updatedProduct = {...products[key][i], [field]:e}
    setProducts({...products, [key]:[...products[key].slice(0, i), updatedProduct, ...products[key].slice(i+1)]})
  }

return <>
  <Head>
    <title>Add Product</title>
    <meta name="description" content='Add new product and categories to the catalog.' />
  </Head>
  <Navbar user={userAuth && userAuth} trigger={searchRequestHandler} passToBottom={passToBottom}/>
  <Container maxWidth="sm" className={classes.Container}>
    <h1>Add new product</h1>
    {success && <Alert variant="filled" color="success" severity="success" className={classes.infoBar}>{`${created} has been created!`}</Alert>}
    {status.info && <Alert variant="filled" color="info" severity="info" className={classes.infoBar}>{status.message}</Alert>}
    <div className={classes.buttonContainer}>
      {success&& <>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.cardTitle}>Go to </Typography>
        <Link href='/admin/products/ProductList' underline='none' className={classes.ButtonMargin}><Button variant="contained" color="primary">Product List</Button></Link>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.cardTitle}> or </Typography>
        <Button variant="contained" color="primary" className={classes.ButtonMargin} onClick={AddAnOtherHandler}>Add More Products</Button></>
      }
    </div>
    <form className={classes.form} onSubmit={submitHandler}>
      <Input type='file' inputProps={{ accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}} onChange={e=>setSelectedFile(e.target.files[0])}/>
      <Button variant="contained" color="primary" type="submit">Add Product</Button>
    </form>
    <form onSubmit={upload_prods_Handler}>
    {products && Object.keys(products).map((key, index)=>(<><h4 key={key}>{key}</h4>{products[key].map((item, i)=>(
      <Paper className={classes.paper} elevation={3} key={i}>
        <TextField className={classes.inputs} style={{width:'100%'}} required type="text" label="Product name" value={item.name} onChange={(e)=> changeProductDetail(e.target.value, i, key, 'name')}/>
        <div className={classes.inputs2ndRow}>
          <TextField className={classes.inputs} InputProps={{startAdornment:<InputAdornment position="start">$</InputAdornment>}} required type="number" label="Price" value={item.price} onChange={(e)=> changeProductDetail(e.target.value, i, key, 'price')}/>
          <TextField className={classes.inputs} required type="number" label="Count In Stock" value={item.countInStock} onChange={(e)=> changeProductDetail(e.target.value, i, key, 'countInStock')}/>
        </div>
        <TextField className={classes.description} multiline={true} required type="text" label="Description" value={item.description} onChange={(e)=> changeProductDetail(e.target.value, i, key, 'description')}/>
        <div className={classes.selects_container}>
          <Select
            className={classes.selects}
            labelId="select-brand-label"
            id="select-brand"
            value={item.brand}
            onChange={(e)=> changeProductDetail(e.target.value, i, key, 'brand')}>
            <MenuItem key={"add_new_brand"} value={"Add New Brand"}>Add New Brand</MenuItem>
            {brands.map((brand)=>(<MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>))}
          </Select>
          {item.brand === "Add New Brand" && <TextField required inputProps={{ maxLength: 32 }} type="text" label="New Brands's name" value={item.newBrand} onChange={(e)=> changeProductDetail(e.target.value, i, key, 'newBrand')}/>}
        </div>
        <div className={classes.selects_container}>
          <Select
            className={classes.selects}
            labelId="select-category-label"
            id="select-category"
            value={item.category}
            onChange={(e)=> changeProductDetail(e.target.value, i, key, 'category')}>
            <MenuItem key={"add_new_category"} value={"Add New Category"}>Add New Category</MenuItem>
            {categories.map((category)=>(<MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>))}
          </Select>
          {item.category === "Add New Category" && <TextField required inputProps={{ maxLength: 32 }} type="text" label="New Category's name" value={item.newCategory} onChange={(e)=> changeProductDetail(e.target.value, i, key, 'newCategory')}/>}
        </div>
      </Paper>))}
    </>))}
    <Button type='submit'>Upload</Button>
    </form>
  </Container>
</>
};

AddProduct.getInitialProps = async ({brands, categories}) => {
  return {brands, categories}
}

export default PrivateRoute(getCategoriesAndBrands(AddProduct));