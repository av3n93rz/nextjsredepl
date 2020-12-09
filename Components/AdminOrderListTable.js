import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import axios from 'axios'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import DeleteDialog from './DeleteDialog'
import StatusDialog from './StatusDialog'

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.background.default,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.background.default,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selected, remove, ordState, statusValues, setOrderStatus} = props;

  const removeHandler = (items) =>{
    remove(items)
  }

  const statusUpdateHandler = async (id, status) =>{
    if(status !== 'status'){
      try {
        const config = {
          headers: {
            'Content-Type':'application/json',
          }
        }
        const orderStatus = await axios.post(`/api/v1/orders/admin/order/set-array-status/`, {status: status, array: id}, config)
        if(orderStatus.status === 200){
          setOrderStatus(id, status)
        }
      } 
      catch (error) {
        console.log(error.message)
      }
    }
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Order List
        </Typography>
      )}

      {numSelected > 0 && <StatusDialog statusUpdateHandler={statusUpdateHandler} selected={selected} statusValues={statusValues} />}
      {numSelected > 0 && <DeleteDialog removeHandler={removeHandler} selected={selected} itemsState={ordState} itemName={'product'}/>}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  statusCell:{
    whiteSpace: 'nowrap'
  }
}));

const EnhancedTable = ({orders, setDeleteState, display, statusValues, setOrderStatus}) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  
const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Id' },
  { id: 'itemsPrice', numeric: true, disablePadding: false, label: 'Items Price' },
  { id: 'totalPrice', numeric: true, disablePadding: false, label: 'Total Price' },
  { id: 'paymentMethod', numeric: false, disablePadding: false, label: 'Payment Method' },
  { id: 'paymentResult', numeric: false, disablePadding: false, label: 'Payment Status' },
  { id: 'shippingMethod', numeric: false, disablePadding: false, label: 'Shipping' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'userId', numeric: false, disablePadding: false, label: 'User' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          display[headCell['id']].disp &&
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
  
  const rows = [];
  orders.map((item)=>{rows.push({shippingMethod:item.shippingMethod, itemsPrice:item.itemsPrice, userId:item.user._id, paymentStatus:item.paymentResult ? item.paymentResult.status:'Not Paid', paymentMethod:item.paymentMethod, status:item.status, totalPrice:item.totalPrice, id:item._id})})
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const removeRows = async (idArray) =>{
    let ordersState = orders
    for(let i = 0; i < idArray.length; i++){
      let itemIndex = orders.indexOf(idArray[i]);
      if(itemIndex > -1){
        try {
          const {status} = await axios.delete(`/api/v1/orders/${idArray[i]._id}`)
          if(status === 200){
            ordersState.splice(itemIndex, 1)
          }
          } catch (error) {
            console.log(error.message)
          }
      }
    }
    setDeleteState(ordersState)
    setSelected([])
  }

  const changeStatus = async (id, status) =>{
    try {
      const config = {
        headers: {
          'Content-Type':'application/json',
        }
      }
      const orderStatus = await axios.post(`/api/v1/orders/admin/order/set-status/${id}`, {status: status}, config)
      if(orderStatus.status === 200){
        setOrderStatus([id], status)
      }
      } catch (error) {
        console.log(error.message)
      }
  }

  return (
    <>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} remove={removeRows} ordState={orders} statusValues={statusValues} setOrderStatus={setOrderStatus}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <Link href={`/admin/orders/id?product=${row.id}`}>
                          {row.id}
                        </Link>
                      </TableCell>
                      {display.itemsPrice.disp && <TableCell align="right">{row.itemsPrice}</TableCell>}
                      {display.totalPrice.disp &&<TableCell align="right">{row.totalPrice}</TableCell>}
                      {display.paymentMethod.disp &&<TableCell align="left">{row.paymentMethod}</TableCell>}
                      {display.paymentResult.disp &&<TableCell align="left">{row.paymentStatus}</TableCell>}
                      {display.shippingMethod.disp &&<TableCell align="left">{row.shippingMethod}</TableCell>}
                      {display.status.disp &&<TableCell align="left" className={classes.statusCell}>
                        <FormControl className={classes.formControl, classes.searchField}>
                          <Select
                            labelId="select-search-col-label"
                            id="select-search-col"
                            value={row.status}
                            onChange={(e)=> changeStatus(row.id, e.target.value)}>
                            {statusValues.map((item)=>(
                              <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>}
                      {display.userId.disp &&
                        <TableCell component="th" scope="row" align="left">
                          <Link href={`/admin/users/id?user=${row.userId}`}>
                            {row.userId}
                          </Link>
                        </TableCell>
                      }
                    </StyledTableRow>
                  );
                })}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={9} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

export default EnhancedTable
