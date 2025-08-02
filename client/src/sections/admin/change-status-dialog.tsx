import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import axiosInstance from '../../utils/axios';
import { useEffect } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack } from '@mui/material';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFSelect } from '../../components/hook-form/RHFSelect';
import { ORDER_STATUSES } from '../../utils/data';
import { LoadingButton } from '@mui/lab';

interface CSD {
    open: boolean;
    closeDialog: () => void;
    currentStatus: string;
    orderId: string;
    reload: () => void;
}

const ChangeStatusDialog = ({ closeDialog, open, currentStatus, orderId, reload }: CSD) => {

    const { enqueueSnackbar } = useSnackbar();

    const OrderStatusSchema = Yup.object().shape({ 
        status: Yup.string().required('Please select a status'),
        orderId: Yup.string(),
    });

    const defaultValues = { status: '', orderId: '' };

    const methods = useForm({ resolver: yupResolver(OrderStatusSchema), defaultValues });

    const { handleSubmit, setError, setValue, formState: { isSubmitting, errors } } = methods;

    useEffect(() => {
        setValue('orderId', orderId);
        setValue('status', currentStatus);
    }, [orderId, currentStatus])

    const submitHandler = async (data: any) => {
        try {
            await axiosInstance.patch('/admin/change-order-status', data);
            enqueueSnackbar('Status changed successfully', { variant:'success' });
            reload();
            closeDialog();
        } catch (error: any) {
            setError('root', { ...error, message: error.message || error, });
        }
    }

  return (
    <Dialog open={open} onClose={closeDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(submitHandler)}>
            <DialogTitle>Change Order Status</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <RHFSelect name='status' label='Order Status' placeholder='Order Status' required>
                        {ORDER_STATUSES.map((sta, ind) => <MenuItem key={ind} value={sta}>{sta}</MenuItem>)}
                    </RHFSelect>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <LoadingButton variant='contained' type='submit' loading={isSubmitting}>Change</LoadingButton>
            </DialogActions>
        </FormProvider>
    </Dialog>
  )
}

export default ChangeStatusDialog