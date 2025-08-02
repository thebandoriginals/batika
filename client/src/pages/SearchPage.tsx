import { useEffect, useState } from "react"
import { CATEGORY, PRODUCT } from "../types"
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, CircularProgress, Grid, Stack, Typography, styled } from "@mui/material";
import { useSnackbar } from "notistack";
import axiosInstance from "../utils/axios";
import ItemInList from "../sections/item/item-in-list";

const CategoryContainer = styled('div')(() => ({
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 20,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
}))

const SearchPage = () => {

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  
  const [sp, _] = useSearchParams();
  const [categories, setCategories] = useState<CATEGORY[]>([]);
  const [products, setProducts] = useState<PRODUCT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getResultsHandler = async () => {
    try {
      setIsLoading(true);
      const query = sp.get('query');
      if (query) {
        const { data } = await axiosInstance.get(`/search-store?query=${query}`);
        setCategories(data.categories);
        setProducts(data.products);
      }
    } catch (err: any) {
      enqueueSnackbar(err, { variant: 'error' })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getResultsHandler();
  }, [sp.get('query')]);

  if (isLoading) return <CircularProgress />

  return (
    <Stack gap={3}>
      <Typography variant='h6'>Search Results</Typography>

      <Stack alignItems='center' gap={1} direction='row'>
        <Typography>Categories</Typography>
        {categories.length === 0 && <Typography variant="body2" textAlign='center' sx={{ flex: 1 }}>No Categories Found</Typography>}
      </Stack>

      <Grid container spacing={3}>
        {categories.map((content, index) => {
          return (
            <Grid item key={index} xs={12} md={6} lg={4}>
              <CategoryContainer style={{ backgroundImage: `url("${content.image}")` }}>
                <Typography color='white' variant='h6' textTransform='uppercase'>{content.name}</Typography>
                <Button onClick={() => { navigate(`/category/${content.slug}`) }} sx={{ mb: 2 }} variant='contained' color='inherit'>Explore</Button>
              </CategoryContainer>
            </Grid>
          )
        })}
      </Grid>

      <Stack alignItems='center' gap={1} direction='row'>
        <Typography>Products</Typography>
        {products.length === 0 && <Typography variant="body2" textAlign='center' sx={{ flex: 1 }}>No Products Found</Typography>}
      </Stack>

      <Grid container spacing={3}>
        {products.map((item, index) => {
          return (
            <Grid key={index} item xs={6} md={3}><ItemInList item={item} /></Grid>
          )
        })}
      </Grid>

    </Stack>
  )
}

export default SearchPage