import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ORDER } from "../types";
import { useSnackbar } from "notistack";
import { Avatar, Box, Card, CardHeader, Chip, CircularProgress, Divider, Grid, IconButton, ListItemText, Stack, Typography } from "@mui/material";
import axiosInstance from "../utils/axios";
import { ArrowBackIos } from "@mui/icons-material";
import { formatNumber } from "../utils/utilities";
import { LoadingButton } from "@mui/lab";
// import PaymentDialog from "../sections/payment/payment-dialog";
import { useAuthContext } from "../auth/auth-context";
import { PAYSTACK_PUBLIC_KEY } from "../config";
import { usePaystackPayment } from 'react-paystack'

const SingleOrderPage = () => {

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [order, setOrder] = useState<ORDER | null>();
  const [isGettingOrder, setIsGettingOrder] = useState<boolean>(true);
  // const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false); 

  const initializePayment = usePaystackPayment({ 
    publicKey: PAYSTACK_PUBLIC_KEY || '',
    currency: 'KES',
  });

  const validatePaymentHandler = async (ref: any) => {
    try {
      const reference = ref.reference;
      setIsValidating(true);
      const response = await axiosInstance.post('/validate-payment', { reference, orderId: order?._id });
      setOrder(response.data.order)
      enqueueSnackbar(response.data.message, { variant: 'success' });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.content || err?.response?.data?.message || err?.message || err || 'Something went wrong';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsValidating(false);
    }
  }

  const initializePaymentHandler = async () => {
    try {
      setIsPaying(true);
      initializePayment({
        config: {
          email: user?.email || '',
          phone: user?.phone || '',
          amount: paymentAmount * 100,
        },
        onSuccess: validatePaymentHandler,
        onClose: () => { enqueueSnackbar('Payment process was closed', { variant: 'info' }) },
      })
    } catch (err: any) {
      const errorMessage = err?.response?.data?.content || err?.response?.data?.message || err?.message || err || 'Something went wrong';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsPaying(false);
    }
  }

  const getOrderHandler = async () => {
    try {
      setIsGettingOrder(true);
      const { data } = await axiosInstance.get(`/user/order/${id}`);
      setOrder(data.order);
      setPaymentAmount(data.order?.payment.amount!)
    } catch (err: any) {
      enqueueSnackbar(err, { variant: "error" });
    } finally {
      setIsGettingOrder(false);
    }
  }

  useEffect(() => {
    getOrderHandler();
  }, [])

  if (isGettingOrder) return <CircularProgress />

  return (
    <>
        {/* <PaymentDialog amount={paymentAmount} closeDialog={() => { setPaymentDialogOpen(false) }} open={paymentDialogOpen} stripePayHandler={stripePayHandler} /> */}
        <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 }, }} >
            <Stack spacing={1} direction="row" alignItems="flex-start">
                <IconButton onClick={() => { navigate(-1) }} size='small'><ArrowBackIos fontSize="small" /></IconButton>
                <Stack spacing={0.5}>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography variant="h4"> Order #{order?.number}</Typography>
                        <Chip label={order?.status} />
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>{new Date(order?.createdAt!).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
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
                            {!order?.payment.paid && <LoadingButton loading={isPaying || isValidating} onClick={initializePaymentHandler} variant="contained">Pay Now</LoadingButton>}
                        </Stack>
                    </>
                </Card>
            </Grid>
        </Grid>
    </>
  )
}

export default SingleOrderPage