import React from 'react';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

const RatingComp = ({rate}) => {
  return (
    <Box component="fieldset" mb={3} borderColor="transparent" style={{marginBottom:'0px'}}>
        <Rating
          name="customized-empty"
          readOnly
          defaultValue={rate}
          precision={0.5}
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
        />
      </Box>
  )
}

export default RatingComp
