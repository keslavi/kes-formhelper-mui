import { Grid } from '@mui/material';
import type { GridProps } from '@mui/material';
import React from 'react';

type RowProps = GridProps & {
  columns?: GridProps['columns'];
};

export const Row = ({ children, columns, ...rest }: RowProps) => (
  <Grid
    container
    spacing={2}
    columns={columns ?? { xs: 2, sm: 4, md: 12 }}
    sx={() => ({
      '.table-using-rows &': { mt: 1, mb: 1 },
      '.table-using-rows & + &': { borderTop: '1px solid #d5d5d5' },
      '.table-using-rows &:last-of-type': {
        borderBottom: '1px solid #d5d5d5',
        paddingBottom: '6px',
      },
    })}
    {...rest}
  >
    {children}
  </Grid>
);

Row.displayName = 'Row';

export const TableRows = ({ children }: { children: React.ReactNode }) => (
  <div className="table-using-rows">{children}</div>
);

export default Row;
