import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ORDER } from '../../types';
import axiosInstance from '../../utils/axios';
import { CircularProgress, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { formatNumber } from '../../utils/utilities';
import { Visibility } from '@mui/icons-material';

const AdminOrdersPage = () => {

  const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<ORDER[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getOrdersHandler = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/user/orders');
            setOrders(data.orders);
        } catch (err: any) {
            enqueueSnackbar(err, { variant: 'error' })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getOrdersHandler();
    }, [])

  return (
    <>
      <Stack sx={{ mb: 2 }} direction='row' gap={1} alignItems='center' justifyContent='space-between'>
        <Typography variant="h6">Orders</Typography>
      </Stack>

      {isLoading && <CircularProgress />}

      {!isLoading && orders.length === 0 && <Typography textAlign='center'>No orders placed</Typography>}

      {!isLoading && orders.length > 0 && <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                      <TableCell>Placed On</TableCell>
                      <TableCell align="right">By</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Total Amount</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, index) => {
                        const navigationHandler = () => {
                            navigate(`/admin/order/${order._id}`)
                        }
                    return (
                        <TableRow key={index}>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                            <TableCell align='right'>{order.customer.firstName}</TableCell>
                            <TableCell align='right'>{order.status}</TableCell>
                            <TableCell align='right'>{formatNumber(order.payment.amount)}</TableCell>
                            <TableCell align='right'><IconButton onClick={navigationHandler}><Visibility /></IconButton></TableCell>
                        </TableRow>
                    )
                    })}
                </TableBody>
            </Table>
        </TableContainer>}
    </>
  )
}

export default AdminOrdersPage