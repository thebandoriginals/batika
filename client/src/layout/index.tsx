import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useState } from "react"
import TopBar from "./top-bar";
import Footer from "./footer";
import NavigationDrawer from "./navigation-drawer";

interface OL {
    children: ReactNode;
    px?: number
}

const OverallLayout = ({ children, px = 4 } : OL) => {

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <>
      <NavigationDrawer closeDrawer={() => { setDrawerOpen(false) }} open={drawerOpen} />
        <TopBar openMenu={() => { setDrawerOpen(true) }} />
        {!isSmallScreen && <Container maxWidth='xl' sx={{ my: 2 }}>{children}</Container>}
        {isSmallScreen && <Box sx={{ my: 2, px }}>{children}</Box>}
        <Footer />
    </>
  )
}

export default OverallLayout
