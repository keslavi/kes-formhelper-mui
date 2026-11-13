import { color } from '../../theme-material';
import { Grid } from '@mui/material';
import type { GridProps } from '@mui/material';
import { isEmpty } from 'lodash';
import { splitHeaderSize, useCleanGridProps } from '../formhelper/helper/clean-grid-props';
import type { HeaderSize } from '../formhelper/helper/clean-grid-props';
import React from 'react';

interface RowSubheaderProps extends Omit<GridProps, 'color'> {
  leftcontent?: React.ReactNode;
  rightcontent?: React.ReactNode;
  children?: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  size?: HeaderSize;
}

export const RowSubheader = ({
  leftcontent,
  rightcontent,
  children,
  backgroundColor,
  color: colorProp,
  size,
  ...rest
}: RowSubheaderProps) => {
  const leftContent2 = leftcontent ?? children;
  const rightContent2 = rightcontent ?? '';
  const backgroundColor2 = backgroundColor ?? color.secondary.blue300;
  const textColor2 = colorProp ?? color.primary.white;

  const hasRight = !isEmpty(rightcontent);
  const { left: leftSize, right: rightSize, rightSx } = splitHeaderSize(size, hasRight);
  const gridProps = useCleanGridProps(rest as Record<string, unknown>, 'rowSubheader');

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
      {...gridProps}
    >
      <Grid container size={leftSize} sx={{
        justifyContent: "flex-start"
      }}>
        <div>{leftContent2}</div>
      </Grid>
      {hasRight && (
        <Grid container size={rightSize} sx={{
          justifyContent: "flex-end",
          ...rightSx,
        }}>
          <div>{rightContent2}</div>
        </Grid>
      )}
    </Grid>
  );
};
