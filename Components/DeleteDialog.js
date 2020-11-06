import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  deleteIconColor: {
    color: theme.palette.background.default,
  },
  question:{
    padding: '0 24px 16px 24px'
  }
}));


const DeleteDialog = ({selected, itemsState, removeHandler, itemName}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let items = []
  selected.forEach(item =>{
    const delItem = itemsState.find(o => o._id === item)
    items.push(delItem)
  })
  
  const removeItems = () =>{
    removeHandler(items)
  }

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <IconButton aria-label="delete" onClick={handleClickOpen}>
        <DeleteIcon className={classes.deleteIconColor}/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Deleting {items.length} {items.length > 1 ? `${itemName}s`:itemName}</DialogTitle>
        <DialogContentText className={classes.question} >Are you sure you want to <strong>delete</strong> these {itemName}s?</DialogContentText>
        <DialogContent dividers={true}>
            {items.map((item)=> (<p key={item._id}>{item.name}</p>))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={removeItems} color="primary">
            Delete {itemName}s
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteDialog
