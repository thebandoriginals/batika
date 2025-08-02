import { useEffect, useState } from "react"
import { ORDER } from "../types"
import { Avatar, Box, Card, CardHeader, Chip, CircularProgress, Divider, Grid, IconButton, ListItemText, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import axiosInstance from "../utils/axios";
import { ArrowBackIos } from "@mui/icons-material";
import { formatNumber } from "../utils/utilities";
import { useAuthContext } from "../auth/auth-context";
import { useNavigate } from "react-router-dom";
import PaymentDialog from "../sections/payment/payment-dialog";
import { LoadingButton } from "@mui/lab";

const CheckoutPage = () => {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { update, setCart } = useAuthContext();    

    const [order, setOrder] = useState<ORDER | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [isPaying, setIsPaying] = useState<boolean>(false);

    const createOrderHandler = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/user/create-order');
            setOrder(data.order);
            setPaymentAmount(data.order?.payment.amount!)
            setCart([]);
            update({ cart: [] });
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }

    const stripePayHandler = async (token?: any) => {
        try {
            setPaymentDialogOpen(false);
            setIsPaying(true);
            await axiosInstance.post(`user/pay`, { token, orderId: order?._id });
            enqueueSnackbar('Payment success', { variant: 'success' });
            setOrder(prev => ({ ...prev, status: 'Paid' } as any))
        } catch (err: any) {
            enqueueSnackbar(err, { variant: 'error' });
        } finally {
            setIsPaying(false);
        }
    }

    useEffect(() => {
        createOrderHandler();
    }, [])

    if (isLoading) return <CircularProgress />

    if (!order) return <Typography>There is no order created</Typography>

  return (
    <>

        <PaymentDialog amount={paymentAmount} closeDialog={() => { setPaymentDialogOpen(false) }} open={paymentDialogOpen} stripePayHandler={stripePayHandler} />

        <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 }, }} >
            <Stack spacing={1} direction="row" alignItems="flex-start">
                <IconButton onClick={() => { navigate(-1) }} size='small'><ArrowBackIos fontSize="small" /></IconButton>
                <Stack spacing={0.5}>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography variant="h4"> Order #{order?.number}</Typography>
                        <Chip label={order?.status} />
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>{new Date(order?.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                </Stack>
            </Stack>
        </Stack>

        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
            <Card>
                <CardHeader title="Products" />
                <Stack sx={{ px: 3, }}>
                    {order?.products?.map((item, index) => (
                        <Stack key={index} direction="row" alignItems="center" sx={{ py: 3, minWidth: 640, borderBottom: (theme) => `dashed 2px ${theme.palette.divider}`, }}>
                            <Avatar src={item.images[0]} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />
                            <ListItemText
                                primary={item.name}
                                secondary={item.slug}
                                primaryTypographyProps={{
                                    typography: 'body2',
                                }}
                                secondaryTypographyProps={{
                                    component: 'span',
                                    color: 'text.disabled',
                                    mt: 0.5,
                                }}
                            />

                            <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>

                            <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>{formatNumber(item.price * item.quantity)}</Box>
                        </Stack>
                    ))}
                    <Stack spacing={2} alignItems="flex-end" sx={{ my: 3, textAlign: 'right', typography: 'body2' }}>
                        <Stack direction="row">
                            <Box sx={{ color: 'text.secondary' }}>Total</Box>
                            <Box sx={{ width: 160, typography: 'subtitle2' }}>$ {formatNumber(order?.payment?.amount!) || '-'}</Box>
                        </Stack>
                    </Stack>
                </Stack>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <>
                        <CardHeader title="Customer Info" />
                        <Stack direction="row" sx={{ p: 3 }}>
                            <Avatar sx={{ width: 48, height: 48, mr: 2 }} />

                            <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
                                <Typography variant="subtitle2">{order?.customer.firstName} {order?.customer?.lastName}</Typography>
                                <Box sx={{ color: 'text.secondary' }}>{order?.customer.email}</Box>
                            </Stack>
                        </Stack>
                    </>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <>
                        <CardHeader title="Payment" />
                        <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
                            {!order?.payment.paid && <LoadingButton loading={isPaying} onClick={() => { setPaymentDialogOpen(true) }} variant="contained">Pay Now</LoadingButton>}
                        </Stack>
                    </>
                </Card>
            </Grid>
        </Grid>
    </>
  )
}

export default CheckoutPage