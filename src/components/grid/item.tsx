import { Paper, styled } from '@mui/material';
import { color } from '../../theme-material';

//adjusting here instead of theme; want to avoid affecting all Paper components, and this is the only place we use it in formhelper-mui
export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? color.primary.backgroundColor : 'inherit',
  boxShadow: 'none',
  backgroundImage: 'none',
  borderRadius: 0,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
}));

export const ItemNoPadding = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? color.primary.backgroundColor : 'inherit',
  boxShadow: 'none',
  backgroundImage: 'none',
  borderRadius: 0,
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'left',
}));
