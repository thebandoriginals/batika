import { AdminPanelSettings, Logout } from "@mui/icons-material"
import { Avatar, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useAuthContext } from "../auth/auth-context";
import { useNavigate } from "react-router-dom";

interface AM {
    anchorEl: any;
    handleClose: () => void;
}


const AccountMenu = ({ anchorEl, handleClose}: AM) => {

    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();

  return (
    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleClose(); navigate('/profile') }}><Avatar /> Profile</MenuItem>
        {user?.role === 'admin' && <MenuItem onClick={() => { handleClose(); navigate('/admin') }}>
          <Avatar><AdminPanelSettings /></Avatar> Admin
        </MenuItem>}
        <MenuItem onClick={() => { handleClose(); logout() }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
  )
}

export default AccountMenu