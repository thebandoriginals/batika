import { Box, Breadcrumbs, Grid, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useLocation, Link as RouterLink, useParams } from "react-router-dom"
import ItemInList from "../sections/item/item-in-list";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { CATEGORY, PRODUCT } from "../types";
import axiosInstance from "../utils/axios";
import LoadingScreen from "../components/loading-screen";

const CategoryPage = () => {

    const { pathname } = useLocation();
    const { slug } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [category, setCategory] = useState<CATEGORY | null>(null);
    const [products, setProducts] = useState<PRODUCT[]>([]);

    const getCategoryHandler = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/single-category?slug=${slug}`);
        setCategory(data.category);
        setProducts(data.products);
      } catch (err: any) {
        enqueueSnackbar(err, { variant: 'error' })
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      getCategoryHandler();
    }, [slug])

    if (isLoading) return <LoadingScreen />

  return (
    <Box sx={{ px: isSmallScreen ? 0 : 3 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" component={RouterLink} to="/">Home</Link>
            <Link underline="hover" color="inherit" component={RouterLink} to={pathname}>{category?.name}</Link>
        </Breadcrumbs>
        <Typography sx={{ my: 5 }} variant='h4' textAlign='center' textTransform='uppercase'>{category?.name}</Typography>
        <Grid container spacing={3}>
        {products.map((item, index) => {
          return (
            <Grid key={index} item xs={6} md={3}><ItemInList item={item} /></Grid>
          )
        })}
      </Grid>
      <Stack sx={{ mt: 5 }} alignItems='center'>
        {/* <Pagination count={10} showFirstButton showLastButton /> */}
      </Stack>
    </Box>
  )
}

export default CategoryPage