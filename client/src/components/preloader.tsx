import { styled } from "@mui/material"

const StyledContainter = styled('div')(() => ({
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const StyledImage = styled('img')(() => ({
    width: '50px'
}))

const Preloader = () => {
  return (
    <StyledContainter>
        <StyledImage src="/logo-1.jpg" alt='Logo' />
    </StyledContainter>
  )
}

export default Preloader