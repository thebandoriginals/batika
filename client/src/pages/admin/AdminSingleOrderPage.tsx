import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { ORDER } from "../../types";
import { Avatar, Box, Button, Card, CardHeader, Chip, CircularProgress, Grid, IconButton, ListItemText, Stack, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { formatNumber } from "../../utils/utilities";
import ChangeStatusDialog from "../../sections/admin/change-status-dialog";

const AdminSingleOrderPage = () => {

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [order, setOrder] = useState<ORDER | null>();
  const [isGettingOrder, setIsGettingOrder] = useState<boolean>(true);
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');

  const getOrderHandler = async () => {
    try {
      setIsGettingOrder(true);
      const { data } = await axiosInstance.get(`/user/order/${id}`);
      setOrder(data.order);
      setCurrentStatus(data.order?.status);
    } catch (err: any) {
      enqueueSnackbar(err, { variant: "error" });
    } finally {
      setIsGettingOrder(false);
    }
  };

  useEffect(() => {
    getOrderHandler();
  }, [])

  if (isGettingOrder) return <CircularProgress />

  return (
    <>

      <ChangeStatusDialog closeDialog={() => { setChangeStatusDialogOpen(false) }} currentStatus={currentStatus} open={changeStatusDialogOpen} orderId={id || ''} reload={getOrderHandler} />

      <Box sx={{ width: '100%', maxWidth: '95vw', margin: 'auto' }}>
          <Stack spacing={3} direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: { xs: 3, md: 5 }, }} >
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
              <Button onClick={() => { setChangeStatusDialogOpen(true) }} variant='contained'>Change Status</Button>
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
                              <Box sx={{ width: 160, typography: 'subtitle2' }}>{formatNumber(order?.payment?.amount!) || '-'}</Box>
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
                  </Card>
              </Grid>
          </Grid>
      </Box>
    </>
  )
}

export default AdminSingleOrderPage