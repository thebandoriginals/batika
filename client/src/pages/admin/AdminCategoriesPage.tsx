import { Avatar, Button, IconButton, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useAuthContext } from "../../auth/auth-context"
import { Delete, Edit } from "@mui/icons-material";
import { Link as RouterLink } from 'react-router-dom';
import { CATEGORY } from '../../types';
import { useState } from "react";
import { useSnackbar } from "notistack";
import axiosInstance from "../../utils/axios";
import DeleteCategoryDialog from "../../sections/admin/delete-category-dialog";
import NewCategoryDialog from "../../sections/admin/new-category-dialog";

const AdminCategoriesPage = () => {

  const { categories, manipulateCategory } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedCategory, setSelectedCategory] = useState<CATEGORY | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openEditDialog = (category: CATEGORY) => {
    setSelectedCategory(category);
    setNewDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedCategory(null);
    setNewDialogOpen(false);
  };

  const openDeleteDialog = (category: CATEGORY) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedCategory(null);
    setDeleteDialogOpen(false);
  };

  const deleteCategoryHandler = async () => {
    try {
      setIsDeleting(true);
      if (selectedCategory) {
        await axiosInstance.delete(`/admin/delete-category/${selectedCategory?._id}`);
        manipulateCategory(selectedCategory, 'Delete');
        enqueueSnackbar('Category deleted successfully', { variant: 'success' });
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

      <DeleteCategoryDialog closeDialog={closeDeleteDialog} deleteHandler={deleteCategoryHandler} isDeleting={isDeleting} open={deleteDialogOpen} />
      <NewCategoryDialog closeDialog={closeEditDialog} open={newDialogOpen} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <Stack sx={{ mb: 2 }} direction='row' gap={1} alignItems='center' justifyContent='space-between'>
        <Typography variant="h6">Categories</Typography>
        <Button onClick={() => { setNewDialogOpen(true) }} variant='contained'>New Category</Button>
      </Stack>

      {categories.length === 0 && <Typography textAlign='center'>No categories created</Typography>}

      {categories.length > 0 && <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Slug</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction='row' gap={1} alignItems='center'>
                      <Avatar variant="rounded" alt={category.name} src={category.image} />
                      <Typography>{category.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align='right'><Link underline='hover' component={RouterLink} to={`/category/${category.slug}`}>{category.slug}</Link></TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' gap={1} alignItems='center' justifyContent='flex-end'>
                      <IconButton onClick={() => { openEditDialog(category) }}  size='small'><Edit fontSize="small" /></IconButton>
                      <IconButton onClick={() => { openDeleteDialog(category) }} size='small'><Delete fontSize="small" /></IconButton>
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

export default AdminCategoriesPage