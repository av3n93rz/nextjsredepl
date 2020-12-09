import React from 'react'
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import Divider from '@material-ui/core/Divider';
import { makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  
  rotateCancel:{
    transform: 'rotate(45deg)'
  },
  ChipContainer:{
    width: 'max-content',
    margin: '20px auto'
  },
  Chips:{
    width: '100%',
    margin: '5px auto'
  },
  disabledChip:{
    pointerEvents: 'none',
    '&:hover':{
      backgroundColor: theme.palette.primary.light
    },
    '& svg':{
      pointerEvents: 'auto',
      '&:hover':{

      }
    }
  }
}));

const TableChips = ({chips, handleDelete, handleDisplay, returnTag}) => {
  const classes = useStyles();
  return (
    <div className={classes.ChipContainer}>
        <div className={classes.Chips}>
          {Object.keys(chips).map(function(key, index){
            if(key === returnTag){
              return
            } else {
              return chips[key].disp && <Chip label={chips[key].title} key={index} onDelete={()=>handleDelete(key)} color="primary" />
            }
          })}
        </div>
        <Divider variant="middle"/>
        <div className={classes.Chips}>
          {Object.keys(chips).map(function(key, index){
            if(key === returnTag){
              return
            } else {
              return !chips[key].disp && <Chip label={chips[key].title} key={index} deleteIcon={<CancelIcon className={classes.rotateCancel} />} onDelete={()=>handleDisplay(key)} className={classes.disabledChip}/>
            }
          })}
        </div>
      </div>
  )
}

export default TableChips
