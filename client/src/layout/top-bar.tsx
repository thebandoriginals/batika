import { AppBar, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useWindowScroll } from 'react-use';
import { useEffect, useState } from "react";
import LargeScreenTopBar from "./large-screen-top-bar";
import SmallScreenTopBar from "./small-screen-top-bar";

interface TB {
    openMenu: () => void;
}

const TopBar = ({ openMenu }: TB) => {

    const { y } = useWindowScroll();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (window.pageYOffset > 100) setScrolled(true);
        else setScrolled(false);
    }, [y]);

  return (
    <AppBar sx={{ transition: '0.5s' }} color='inherit' elevation={scrolled ? 10 : 0} position={scrolled ? 'fixed' : 'static'}>
        <Toolbar>
            {!isSmallScreen && <LargeScreenTopBar />}
            {isSmallScreen && <SmallScreenTopBar openMenu={openMenu} />}
        </Toolbar>
    </AppBar>
  )
}

export default TopBar