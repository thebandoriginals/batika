import { useEffect, useState } from "react"
import { ORDER } from "../../types"
import { useSnackbar } from "notistack";
import { CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { formatNumber } from "../../utils/utilities";
import { Visibility } from "@mui/icons-material";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {

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

    if (isLoading) return <CircularProgress />

  return (
    <>
        {orders.length === 0 && <Typography textAlign='center'>You have not placed any order</Typography>}
        {orders.length > 0 && <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Placed On</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                    <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, index) => {
                        const navigationHandler = () => {
                            navigate(`/order/${order._id}`)
                        }
                    return (
                        <TableRow key={index}>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
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

export default OrdersList