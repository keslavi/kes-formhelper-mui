import { Box, Toolbar, Typography } from '@mui/material';
import { color } from '../../theme-material';
import type { ReactNode, CSSProperties } from 'react';

interface NavbarProps {
  children?: ReactNode;
  /** Element to align to the right side of the bar */
  alignRight?: ReactNode;
  style?: CSSProperties;
}

export const Navbar = ({ children, alignRight, style }: NavbarProps) => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }} style={style}>
        <Toolbar
          disableGutters
          variant="dense"
          sx={{
            boxShadow: 'none',
            bgcolor: color.primary.white,
            color: color.primary.blue,
            minHeight: '35px',
            width: '96%',
            zIndex: 3000,
            padding: '3px 0px',
            display: 'flex',
          }}
        >
          <Typography component="div" sx={{ flexGrow: 1 }}>
            {children}
          </Typography>
          {alignRight}
        </Toolbar>
      </Box>
      <br />
      <br />
    </>
  );
};

export default Navbar;
