import { Avatar, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../auth/auth-context";
import { formatNumber } from "../utils/utilities";
import { CART_ITEM, PRODUCT } from "../types";
import { Add, Remove } from "@mui/icons-material";
import { useState } from "react";

interface CD {
  open: boolean;
  closeDialog: () => void;
  proceed: () => void;
}

const ConfirmationDialog = ({ closeDialog, open, proceed }: CD) => (
  <Dialog open={open} onClose={closeDialog}>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogContent>
      <DialogContentText>Are you sure you want to proceed?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={closeDialog}>No</Button>
      <Button onClick={proceed} variant="contained" autoFocus>Proceed</Button>
    </DialogActions>
  </Dialog>
)

const CartPage = () => {

  const { cart, manageCart } = useAuthContext();

  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const proceedHandler = () => {
    setDialogOpen(false);
    navigate('/checkout')
  }

  const handleCartClick = (ci: CART_ITEM, method: 'Add' | 'Remove') => {
      const updatedProduct = { ...ci, sizes: [], colors: [], categories: [] } as PRODUCT;
      manageCart(updatedProduct, ci.size!, ci.color!, method);
  }

  return (
    <>

      <ConfirmationDialog closeDialog={() => { setDialogOpen(false) }} open={dialogOpen} proceed={proceedHandler} />
  
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">Home</Link>
        <Link underline="hover" color="inherit" component={RouterLink} to='/cart'>Shopping Cart</Link>
      </Breadcrumbs>

      <Typography sx={{ my: 3 }} variant='h4' textTransform='uppercase'>Shopping Cart</Typography>

      {cart.length === 0 && <Typography textAlign='center'>You have not added anything to cart</Typography>}

      {cart.length > 0 && <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((cartItem, index) => {

              return (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction='row' gap={1} alignItems='center'>
                      <Avatar variant="rounded" alt={cartItem.name} src={cartItem.images[0]} />
                      <Typography>{cartItem.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align='right'>{formatNumber(cartItem.price)}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' gap={1} alignItems='center' justifyContent='flex-end'>
                      <IconButton onClick={() => { handleCartClick(cartItem, 'Remove') }}><Remove /></IconButton>
                      <Typography>{cartItem.quantity}</Typography>
                      <IconButton onClick={() => { handleCartClick(cartItem, 'Add') }}><Add /></IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell align='right'>{formatNumber(cartItem.price * cartItem.quantity)}</TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              <TableCell colSpan={3} align="right">Subtotal</TableCell>
              <TableCell align="right">{formatNumber(cart.reduce((acc, item) => acc + (item.price * item.quantity),0))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={4}><Button onClick={() => { setDialogOpen(true) }} variant="contained" >Checkout</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>}
      
    </>
  )
}

export default CartPage