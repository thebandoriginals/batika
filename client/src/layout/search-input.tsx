import { Search } from '@mui/icons-material'
import { InputAdornment, Paper, TextField } from '@mui/material'
import { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SI {
    variant?: 'standard' | 'filled' | 'outlined'
}

const SearchInput = ({ variant = 'outlined' }: SI) => {

    const [input, setInput] = useState<string>('');
    const navigate = useNavigate();

    const searchHandler = (e: SyntheticEvent) => {
      e.preventDefault();
      if (input.length > 0) {
        navigate(`/search?query=${input}`)
      }
    }

  return (
    <Paper sx={{ width: '100%' }} elevation={0} component='form' onSubmit={searchHandler}>
      <TextField
          fullWidth
          variant={variant}
          placeholder="Search Our Store..."
          value={input}
          onChange={(e) => { setInput(e.target.value) }}
          InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
          }}
      />
    </Paper>
  )
}

export default SearchInput