import { Button, Grid, Stack, Typography, styled, useMediaQuery, useTheme } from "@mui/material";
// import ThirdImage from '../assets/image-3.jpeg';
import ItemInList from "../sections/item/item-in-list";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/auth-context";

// const TopImageContainer = styled('div')(({ theme }) => ({
//   height: '100vh',
//   width: '100%',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   overflow: 'hidden',
//   [theme.breakpoints.down('md')]: {
//     height: '100%',
//   }
// }));

// const TopImage = styled('img')(() => ({
//   // height: '100%',
//   width: '100%',
//   objectFit: 'cover'
// }));

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

const LandingPage = () => {

  const navigate = useNavigate();
  const { categories, products } = useAuthContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Stack gap={3}>
      {/* <TopImageContainer onClick={() => { navigate(`/category/inside-out`) }}>
        <TopImage alt='top' src='/hero.png' />
      </TopImageContainer> */}

      {/* <marquee style={{ color: 'red', fontSize: '3em' }}>Test</marquee> */}

      <Stack gap={3} sx={{ ...(isSmallScreen && { px: 2 }) }}>
        <Grid container spacing={3}>
          {categories.map((content, index) => {
            return (
              <Grid item key={index} xs={12} md={6} lg={4}>
                <CategoryContainer style={{ backgroundImage: `url("${content.image}")` }}>
                  <Typography color={content.image ? 'white' : 'black'} variant='h6' textTransform='uppercase'>{content.name}</Typography>
                  <Button onClick={() => { navigate(`/category/${content.slug}`) }} sx={{ mb: 2 }} variant='contained' color='inherit'>Explore</Button>
                </CategoryContainer>
              </Grid>
            )
          })}
        </Grid>

        <Typography textTransform='uppercase' textAlign='center' variant='h3'>New Arrivals</Typography>

        <Grid container spacing={3}>
          {products.filter((_, index) => index < 6).map((item, index) => {
            return (
              <Grid key={index} item xs={6} md={4}><ItemInList item={item} /></Grid>
            )
          })}
        </Grid>
      </Stack>

    </Stack>
  )
}

export default LandingPage