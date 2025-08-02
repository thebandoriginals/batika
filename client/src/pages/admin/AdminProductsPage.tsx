import { Avatar, Button, IconButton, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useAuthContext } from "../../auth/auth-context"
import { Delete, Edit } from "@mui/icons-material";
import { Link as RouterLink } from 'react-router-dom';
import { formatNumber } from "../../utils/utilities";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { PRODUCT } from "../../types";
import axiosInstance from "../../utils/axios";
import DeleteProductDialog from "../../sections/admin/delete-product-dialog";
import NewProductDialog from "../../sections/admin/new-product-dialog";

const AdminProductsPage = () => {

  const { products, manipulateProduct } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [selectedProduct, setSelectedProduct] = useState<PRODUCT | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openEditDialog = (product: PRODUCT) => {
    setSelectedProduct(product);
    setNewDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedProduct(null);
    setNewDialogOpen(false);
  };

  const openDeleteDialog = (product: PRODUCT) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedProduct(null);
    setDeleteDialogOpen(false);
  };

  const deleteProductHandler = async () => {
    try {
      setIsDeleting(true);
      if (selectedProduct) {
        await axiosInstance.delete(`/admin/delete-product/${selectedProduct?._id}`);
        manipulateProduct(selectedProduct, 'Delete');
        enqueueSnackbar('Product deleted successfully', { variant: 'success' });
        closeDeleteDialog();
      }
    } catch (err: any) {
      enqueueSnackbar(err, { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>

      <DeleteProductDialog closeDialog={closeDeleteDialog} deleteHandler={deleteProductHandler} isDeleting={isDeleting} open={deleteDialogOpen} />
      <NewProductDialog closeDialog={closeEditDialog} open={newDialogOpen} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />

      <Stack sx={{ mb: 2 }} direction='row' gap={1} alignItems='center' justifyContent='space-between'>
        <Typography variant="h6">Products</Typography>
        <Button onClick={() => { setNewDialogOpen(true) }} variant='contained'>New Product</Button>
      </Stack>

      {products.length === 0 && <Typography textAlign='center'>No products created</Typography>}

      {products.length > 0 && <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Slug</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction='row' gap={1} alignItems='center'>
                      <Avatar variant="rounded" alt={product.name} src={product.images[0]} />
                      <Typography>{product.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align='right'><Link underline='hover' component={RouterLink} to={`/product/${product.slug}`}>{product.slug}</Link></TableCell>
                  <TableCell align="right">{formatNumber(product.price)}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' gap={1} alignItems='center' justifyContent='flex-end'>
                      <IconButton onClick={() => { openEditDialog(product) }} size='small'><Edit fontSize="small" /></IconButton>
                      <IconButton onClick={() => { openDeleteDialog(product) }} size='small'><Delete fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>}
    </>
  )
}

export default AdminProductsPage