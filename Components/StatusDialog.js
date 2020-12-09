import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  deleteIconColor: {
    color: theme.palette.background.default,
  },
  question:{
    padding: '0 24px 16px 24px'
  },
  statusChanger:{
    minWidth:'auto',
    '& svg':{
      color: 'white'
    },
    '& div':{
      color:'white',
      '&:before':{
        borderBottom: '1px solid rgba(255, 255, 255, 0.42)',
      }
    },
    '&:hover':{
      '& div':{
        '&:before':{
          borderBottom: '2px solid rgba(255, 255, 255, 0.87) !important'
        }
      }
    }
  }
}));


const StatusDialog = ({selected, statusUpdateHandler, statusValues}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState('');

  console.log(selected)

  const handleClickOpen = (stat) => {
    setStatus(stat)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const updateStatus = () =>{
    statusUpdateHandler(selected, status)
    setOpen(false);
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
      <FormControl className={classes.statusChanger}>
                          <Select
                            labelId="select-search-col-label"
                            id="select-search-col"
                            value={'status'}
                            onChange={(e)=> handleClickOpen(e.target.value)}>
                              <MenuItem key='status' value='status'>Set status</MenuItem>
                            {statusValues.map((item)=>(
                              <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Updating {selected.length} {selected.length > 1 ? `orders`:'order'}</DialogTitle>
        <DialogContentText className={classes.question} >Are you sure you want to set <strong>{status}</strong> status on these orders?</DialogContentText>
        <DialogContent dividers={true}>
            {selected.map((item)=> (<p key={item}>{item}</p>))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateStatus} color="primary">
            Update orders
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StatusDialog
