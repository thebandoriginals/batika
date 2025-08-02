import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DCD {
  open: boolean;
  closeDialog: () => void;
  isDeleting: boolean;
  deleteHandler: () => void;
}

const DeleteCategoryDialog = ({ closeDialog, deleteHandler, isDeleting, open }: DCD) => {
  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete the selected category?</DialogContentText>
      </DialogContent>
      <DialogActions>
        {!isDeleting && <Button onClick={closeDialog}>No</Button>}
        <LoadingButton loading={isDeleting} variant='contained' onClick={deleteHandler}>Yes</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCategoryDialog