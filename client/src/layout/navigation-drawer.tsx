import { Close } from "@mui/icons-material";
import { Divider, Drawer, IconButton, Link, List, ListItem, ListItemText, Stack } from "@mui/material";
import SearchInput from "./search-input";
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Fragment, useEffect } from "react";
import { useAuthContext } from "../auth/auth-context";

interface ND {
    open: boolean;
    closeDrawer: () => void;
}

const NavigationDrawer = ({ open, closeDrawer }: ND) => {

  const { categories } = useAuthContext();
  const { pathname } = useLocation();

  useEffect(() => {
    closeDrawer();
  }, [pathname])

  return (
    <Drawer
        open={open}
        onClose={closeDrawer}
        anchor="top"
        sx={{ '& .MuiDrawer-paper': { height: '100vh' } }}
    >
        <Stack sx={{ p: 2 }} gap={3}>
            <IconButton sx={{ width: 'fit-content', alignSelf: 'flex-end' }} onClick={closeDrawer}><Close /></IconButton>
            <SearchInput />
            <List component='nav'>
              {categories.map((category, index) => {
                return (
                  <Fragment key={index}>
                    <Link onClick={closeDrawer} color='inherit' component={RouterLink} to={`/category/${category.slug}`} underline="none">
                      <ListItem>
                        <ListItemText primary={category.name} />
                      </ListItem>
                    </Link>
                    <Divider />
                  </Fragment>
                )
              })}
            </List>
        </Stack>
    </Drawer>
  )
}

export default NavigationDrawer