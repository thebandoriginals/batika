import { Facebook, Instagram, Pinterest, YouTube } from "@mui/icons-material";
import { Box, Button, Container, Divider, InputAdornment, Link, Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div style={{ width: '100%', backgroundColor: '#e7e7e7' }}>
        <Container maxWidth='xl'>
            <Stack sx={{ py: 10 }} gap={3}>
                <Stack sx={{ width: isSmallScreen ? '100%' : '50%' }} alignSelf='center' gap={2} alignItems='center'>
                    <Typography variant='body2'>Subscribe to receive updates, access to exclusive deals, and more.</Typography>
                    <TextField
                        name='email'
                        type='email'
                        label='Email Address'
                        placeholder="Email Address"
                        fullWidth
                        variant="standard"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <Button sx={{ mb: 2 }} variant='contained' >Submit</Button>
                            </InputAdornment>
                        }}
                    />
                </Stack>
                <Divider />
                <Stack direction={{ xs: 'column', md: 'row' }} gap={5} sx={{ mb: 5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography gutterBottom variant='h6'>ABOUT US</Typography>
                        <Typography gutterBottom>At Batica, we believe that fashion is not just about clothing; it's a statement of individuality and self-expression.</Typography>
                        <Stack gap={1} sx={{ mt: 3 }}>
                            <Stack direction='row' gap={0.5}>
                                <Typography variant='caption' fontWeight='600'>Operation Hours:</Typography>
                                <Typography variant='caption'>8-5 till Saturdays, applies for holidays. Closed on Sundays</Typography>
                            </Stack>
                            <Stack direction='row' gap={0.5}>
                                <Typography variant='caption' fontWeight='600'>Phone Number:</Typography>
                                <Typography variant='caption'>0700750972</Typography>
                            </Stack>
                            <Stack direction='row' gap={0.5}>
                                <Typography variant='caption' fontWeight='600'>Email Address:</Typography>
                                <Typography variant='caption'>info@batica.co.ke</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    {isSmallScreen && <Divider />}
                    <Stack sx={{ flex: 1 }} gap={2}>
                        <Typography variant='h6'>QUICK LINKS</Typography>
                        <Link color='text.secondary' underline="none" component={RouterLink} to='/affiliate'>Affiliate</Link>
                        <Link color='text.secondary' underline="none" component={RouterLink} to='/exchange-and-refund-policy'>Exchange and Refund Policy</Link>
                        <Link color='text.secondary' underline="none" component={RouterLink} to='/shipping-information'>Shipping Information</Link>
                        <Link color='text.secondary' underline="none" component={RouterLink} to='/privacy-policy'>Privacy Policy</Link>
                        <Link color='text.secondary' underline="none" component={RouterLink} to='/contact-us'>Contact Us</Link>
                    </Stack>
                    {isSmallScreen && <Divider />}
                    <Stack sx={{ flex: 1 }} alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
                        <Typography variant='h6'>Follow Us</Typography>
                        <Stack direction='row' gap={2}>
                            <Tooltip title='Facebook'>
                                <Link><Facebook color="action" /></Link>
                            </Tooltip>
                            <Tooltip title='Instagram'>
                                <Link><Instagram color="action" /></Link>
                            </Tooltip>
                            <Tooltip title='YouTube'>
                                <Link><YouTube color="action" /></Link>
                            </Tooltip>
                            <Tooltip title='Tiktok'>
                                <Link><Facebook color="action" /></Link>
                            </Tooltip>
                            <Tooltip title='PInterest'>
                                <Link><Pinterest color="action" /></Link>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Stack>
                <Typography color='text.secondary' variant="caption">Copyright © 2023 Batica</Typography>
            </Stack>
        </Container>
    </div>
  )
}

export default Footer
