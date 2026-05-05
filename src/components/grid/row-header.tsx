import { color } from '../../theme-material';
import { Grid } from '@mui/material';
import type { GridProps } from '@mui/material';
import { isEmpty } from 'lodash';
import React from 'react';

interface RowHeaderProps extends Omit<GridProps, 'color'> {
  leftcontent?: React.ReactNode;
  rightcontent?: React.ReactNode;
  children?: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  size?: number;
}

export const RowHeader = ({
  leftcontent,
  rightcontent,
  children,
  backgroundColor,
  color: colorProp,
  size,
  ...rest
}: RowHeaderProps) => {
  const leftContent2 = leftcontent ?? children;
  const rightContent2 = rightcontent ?? '';
  const backgroundColor2 = backgroundColor ?? color.secondary.blue700;
  const textColor2 = colorProp ?? color.primary.white;

  const leftSize = isEmpty(rightcontent) ? 12 : size ?? 10;
  const rightSize = 12 - leftSize;

  return (
    <Grid
      container
      sx={{
        height: '35px',
        backgroundColor: backgroundColor2,
        color: textColor2,
        fontSize: '1.2rem',
        padding: '3px',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
      }}
      {...rest}
    >
      <Grid container size={leftSize} justifyContent="flex-start">
        <div>{leftContent2}</div>
      </Grid>
      {leftSize < 12 && (
        <Grid container size={rightSize} justifyContent="flex-end">
          <div>{rightContent2}</div>
        </Grid>
      )}
    </Grid>
  );
};
