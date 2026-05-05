import { Grid } from '@mui/material';
import type { GridProps } from '@mui/material';
import { memo, useMemo } from 'react';
import { Item, ItemNoPadding } from './item';

const DEFAULT_SIZE = 3;

type ResponsiveSize = number | 'auto' | { xs?: number | 'auto'; sm?: number | 'auto'; md?: number | 'auto'; lg?: number | 'auto'; xl?: number | 'auto' };

interface ColBaseProps extends Omit<GridProps, 'size' | 'offset' | 'flex'> {
  /** MUI v6+ unified size prop */
  size?: ResponsiveSize;
  /** MUI v5 breakpoint props — converted automatically to v6+ format */
  xs?: number | 'auto';
  sm?: number | 'auto';
  md?: number | 'auto';
  lg?: number | 'auto';
  xl?: number | 'auto';
  offset?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Set to true or a numeric flex value for auto-sizing columns */
  flex?: boolean | number;
}

function useResponsiveSize(props: ColBaseProps): ResponsiveSize {
  const { size, xs, sm, md, lg, xl, flex } = props;
  return useMemo(() => {
    const hasBreakpoints = xs !== undefined || sm !== undefined || md !== undefined || lg !== undefined || xl !== undefined;

    if (size !== undefined) return size;
    if (flex !== undefined && !hasBreakpoints) return 'auto';

    if (hasBreakpoints) {
      return {
        ...(xs !== undefined && { xs }),
        ...(sm !== undefined && { sm }),
        ...(md !== undefined && { md }),
        ...(lg !== undefined && { lg }),
        ...(xl !== undefined && { xl }),
      };
    }
    return DEFAULT_SIZE;
  }, [size, xs, sm, md, lg, xl, flex]);
}

const ColComponent = (props: ColBaseProps) => {
  const { children, xs, sm, md, lg, xl, offset, flex, style, className, sx, size: _size, ...rest } = props;

  const responsiveSize = useResponsiveSize(props);
  const hasBreakpoints = xs !== undefined || sm !== undefined || md !== undefined || lg !== undefined || xl !== undefined;

  const gridProps = useMemo(() => {
    const p: Record<string, unknown> = { size: responsiveSize, ...rest };
    if (offset !== undefined) p.offset = offset;
    if (flex !== undefined && !hasBreakpoints && _size === undefined) {
      p.style = { ...style, flex: flex === true ? 1 : flex };
    } else if (style !== undefined) {
      p.style = style;
    }
    if (className !== undefined) p.className = className;
    if (sx !== undefined) p.sx = sx;
    return p;
  }, [responsiveSize, offset, flex, hasBreakpoints, _size, style, className, sx, rest]);

  const itemProps = useMemo(() => {
    const p: Record<string, unknown> = {};
    if (style) p.style = style;
    if (className) p.className = className;
    if (sx) p.sx = sx;
    return p;
  }, [style, className, sx]);

  return (
    <Grid {...(gridProps as GridProps)}>
      <ItemNoPadding {...itemProps}>{children}</ItemNoPadding>
    </Grid>
  );
};

export const Col = memo(ColComponent);
Col.displayName = 'Col';

const ColPaddedComponent = (props: ColBaseProps) => {
  const { children, xs, sm, md, lg, xl, offset, flex, style, className, sx, size: _size, ...rest } = props;

  const responsiveSize = useResponsiveSize(props);
  const hasBreakpoints = xs !== undefined || sm !== undefined || md !== undefined || lg !== undefined || xl !== undefined;

  const gridProps = useMemo(() => {
    const p: Record<string, unknown> = { size: responsiveSize, ...rest };
    if (offset !== undefined) p.offset = offset;
    if (flex !== undefined && !hasBreakpoints && _size === undefined) {
      p.style = { ...style, flex: flex === true ? 1 : flex };
    } else if (style !== undefined) {
      p.style = style;
    }
    if (className !== undefined) p.className = className;
    if (sx !== undefined) p.sx = sx;
    return p;
  }, [responsiveSize, offset, flex, hasBreakpoints, _size, style, className, sx, rest]);

  const itemProps = useMemo(() => {
    const p: Record<string, unknown> = {};
    if (style) p.style = style;
    if (className) p.className = className;
    if (sx) p.sx = sx;
    return p;
  }, [style, className, sx]);

  return (
    <Grid {...(gridProps as GridProps)}>
      <Item {...itemProps}>{children}</Item>
    </Grid>
  );
};

export const ColPadded = memo(ColPaddedComponent);
ColPadded.displayName = 'ColPadded';
