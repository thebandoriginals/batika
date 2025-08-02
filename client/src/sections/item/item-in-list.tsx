import { Stack, Typography, styled, Link } from "@mui/material";
import { PRODUCT } from "../../types";
import { formatNumber } from "../../utils/utilities";
import { Link as RouterLink } from 'react-router-dom';
import { ReactNode } from "react";

const ItemImageContainer = styled('div')(({ theme }) => ({
  height: '400px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    height: '200px'
  }
}));

const ItemImage = styled('img')(() => ({
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  transition: '0.5s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.15)',
  }
}));

interface IIL {
  item: PRODUCT
}

const ItemInList = ({ item }: IIL) => {

  const EachItemLink = ({ children }: { children: ReactNode }) => {
    return (
      <Link component={RouterLink} to={`/product/${item.slug}`} underline="none">
        {children}
      </Link>
    )
  }

  return (
    <Stack sx={{ width: '100%' }} gap={2} alignItems='center'>
      <EachItemLink>
        <ItemImageContainer>
          <ItemImage alt={item.name} src={item?.images[0]} />
        </ItemImageContainer>
      </EachItemLink>
      <Stack gap={1} alignItems='center'>
        <EachItemLink>
          <Typography>{item.name}</Typography>
        </EachItemLink>
        <Typography>{formatNumber(item.price)}</Typography>
      </Stack>
    </Stack>
  )
}

export default ItemInList