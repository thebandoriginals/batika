import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Logo = () => {
  return (
    <Link component={RouterLink} to='/'>
        <img style={{ width: 100 }} alt='logo' src='/logo-2.jpg' />
    </Link>
  )
}

export default Logo