import { useParams } from "react-router-dom"
import { Box, Breadcrumbs, Button, Chip, Grid, IconButton, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { closest } from 'color-2-name';
import colorNameToHex from '@uiw/react-color-name';
import { formatNumber } from "../utils/utilities";
import { useEffect, useState } from "react";
import { Add, Remove, ShoppingCart } from "@mui/icons-material";
import { PRODUCT } from "../types";
import { useSnackbar } from "notistack";
import axiosInstance from "../utils/axios";
import LoadingScreen from "../components/loading-screen";
import { useAuthContext } from "../auth/auth-context";
import ColorPicker from "../components/color-utils/color-picker";
import { Controller, useForm } from "react-hook-form";
import Carousel from 'react-material-ui-carousel'

const SingleProductPage = () => {

    const { slug } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { cart, manageCart } = useAuthContext();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const [product, setProduct] = useState<PRODUCT | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [selectedSize, setSelectedSize] = useState<string>('');

    const defaultValues = { color: '' };

    const methods = useForm({ defaultValues });

    const { watch, control, setValue } = methods;

    const values = watch();

    const handleCartClick = (method: 'Add' | 'Remove') => {
      if (product) {
        let selectedColor = values.color;
        if (values.color) {
          const sc = closest(values.color).name;
          selectedColor = product.colors.find(c => c.trim().toLowerCase() === sc) || ''
        }
        manageCart(product, selectedSize, selectedColor, method);
      }
    }

    const getProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/single-product?slug=${slug}`);
        setProduct(data.product);
        setSelectedSize(data.product?.sizes[0])
      } catch (err: any) {
        enqueueSnackbar(err, { variant: 'error' })
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (product) {
        const foundItemInCart = cart.find(it => it._id === product._id);
        if (foundItemInCart) {
          if (foundItemInCart.color) setValue('color', colorNameToHex(foundItemInCart.color.toLowerCase() as any));
          if (foundItemInCart.size) setSelectedSize(foundItemInCart.size)
        }
      }
    }, [product])

    useEffect(() => {
      getProduct();
    }, [slug]);

    if (isLoading) return <LoadingScreen />

  return (
    <Box sx={{ px: 3 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" component={RouterLink} to="/">Home</Link>
            <Link underline="hover" color="inherit" component={RouterLink} to={`/product/${slug}`}>{product?.name}</Link>
        </Breadcrumbs>

        <Grid container spacing={3} sx={{ width: isSmallScreen ? '100%' : '75%', margin: 'auto' }}>
          <Grid item xs={12} md={6}>
            <Carousel animation="slide" duration={1000}>
              {product?.images.map((image, index) => <img key={index} alt={product?.name} src={image} style={{ width: '100%', objectFit: 'cover' }} />)}
            </Carousel> 
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack gap={2}>
              <div>
                <Typography variant='h5' fontWeight='600'>{product?.name}</Typography>
                <Typography variant='h6'>{formatNumber(product?.price!)}</Typography>
              </div>
              <Stack gap={1} direction='row' alignItems='center' flexWrap='wrap'>
                {product?.sizes.map((size, index) => {
                  return (
                    <Chip onClick={() => { setSelectedSize(size) }} color={selectedSize === size ? 'primary' : 'default'} key={index} label={size} />
                  )
                })}
              </Stack>
              <Controller
                name='color'
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    colors={product?.colors.map(col => colorNameToHex(col.toLowerCase() as any))}
                    selected={field.value}
                    onSelectColor={field.onChange}
                    // limit={4}
                  />
                )}
              />
              {!cart.find(ci => ci._id === product?._id) && <Button variant='contained' startIcon={<ShoppingCart />} sx={{ width: 'fit-content' }} onClick={() => { handleCartClick('Add') }}>Add To Cart</Button>}
              {cart.find(ci => ci._id === product?._id) && <Stack direction='row' gap={1} alignItems='center'>
                <IconButton onClick={() => { handleCartClick('Remove') }}><Remove /></IconButton>
                <Typography>{cart.find(ci => ci._id === product?._id)?.quantity}</Typography>
                <IconButton onClick={() => { handleCartClick('Add') }}><Add /></IconButton>
              </Stack>}
            </Stack>
          </Grid>
        </Grid>
    </Box>
  )
}

export default SingleProductPage