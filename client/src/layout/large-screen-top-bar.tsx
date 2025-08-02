
import { Badge, Box, Container, IconButton, Link, Stack } from "@mui/material";
import { Person, Search, ShoppingCartOutlined } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from "../components/logo";
import { useWindowScroll } from 'react-use';
import { useEffect, useState } from "react";
import SearchInput from "./search-input";
import { useAuthContext } from "../auth/auth-context";
import AccountMenu from "./account-menu";



const LargeScreenTopBar = () => {
    const { y } = useWindowScroll();
    const navigate = useNavigate();
    const { categories, isAuthenticated, cart } = useAuthContext();

    const [scrolled, setScrolled] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isAuthenticated) setAnchorEl(event.currentTarget);
        else if (!isAuthenticated) navigate('/auth/login')
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    
    useEffect(() => {
        if (window.pageYOffset > 100) setScrolled(true);
        else setScrolled(false);
    }, [y]);

    const renderCategoryMenu = (
        <Stack direction='row' alignItems='center' gap={2} sx={{ width: '100%', }}>
            {categories.filter((_, index) => index < 6).map((category, index) => <Link key={index} component={RouterLink} to={`/category/${category.slug}`} variant='h6' underline="hover">{category.name}</Link>)}
        </Stack>
    )

  return (
    <>
        <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />
        <Container maxWidth='xl'>
            <Stack sx={{ width: '100%' }}>
                <Stack direction='row' alignItems='center' justifyContent='space-between' gap={scrolled ? 10 : 2} sx={{ width: '100%', py: 1 }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        {scrolled && <Search />}
                        {!scrolled && <SearchInput variant="standard" />}
                    </Box>
                    {!scrolled && <Stack alignItems='center' justifyContent='center' sx={{ flex: 1 }}>
                        <Logo />
                    </Stack>}
                    {scrolled && renderCategoryMenu}
                    <Stack sx={{ flex: 1 }} direction='row' alignItems='center' gap={1} justifyContent='flex-end'>
                        <IconButton 
                            onClick={handleClick}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Person />
                        </IconButton>
                        <IconButton onClick={() => { navigate('/cart') }}>
                            <Badge 
                                badgeContent={<>
                                    {cartQuantity > 0 && <Box sx={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'black', color: 'white' }}>
                                        <p>{cartQuantity}</p>
                                    </Box>}
                                </>}
                            >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Stack>
                </Stack>
                {!scrolled && renderCategoryMenu}
            </Stack>
        </Container>
    </>
  )
}

export default LargeScreenTopBar