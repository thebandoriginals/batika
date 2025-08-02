import { Badge, Box, IconButton, Stack } from "@mui/material"
import Logo from "../components/logo"
import { useWindowScroll } from "react-use";
import { useEffect, useState } from "react";
import { Menu, Person, Search, ShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/auth-context";
import AccountMenu from "./account-menu";

interface SCTP {
    openMenu: () => void;
}

const SmallScreenTopBar = ({ openMenu }: SCTP) => {

    const { y } = useWindowScroll();
    const navigate = useNavigate();
    const { isAuthenticated, cart } = useAuthContext();

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

  return (
    <>
        <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />
        <Stack sx={{ width: '100%' }}>
            {!scrolled && <Stack alignItems='center' justifyContent='center'><Logo /></Stack>}
            <Stack direction='row' gap={2} alignItems='center' justifyContent='space-between'>
                <IconButton onClick={openMenu}><Menu /></IconButton>
                <Stack direction='row' gap={1} alignItems='center'>
                    <IconButton><Search /></IconButton>
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
                                {cartQuantity && <Box sx={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'black', color: 'white' }}>
                                    <p>{cartQuantity}</p>
                                </Box>}
                            </>}
                        >
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Stack>
            </Stack>
        </Stack>
    </>
  )
}

export default SmallScreenTopBar