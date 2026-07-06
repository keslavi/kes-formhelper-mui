import { Grid } from '@mui/material';
import type { GridProps } from '@mui/material';
import { memo, useMemo } from 'react';
import { cleanGridProps, type ColSizeProps } from '../formhelper/helper/clean-grid-props';
import { Item, ItemNoPadding } from './item';

const DEFAULT_SIZE = 3;

type ResponsiveSize = number | 'auto' | { xs?: number | 'auto'; sm?: number | 'auto'; md?: number | 'auto'; lg?: number | 'auto'; xl?: number | 'auto' };

interface ColBaseProps extends Omit<GridProps, 'size' | 'offset' | 'flex'>, ColSizeProps {}

function useResponsiveSize(props: ColSizeProps): ResponsiveSize {
  const { size, xs, sm, md, lg, xl, flex } = props;
  return useMemo(() => {
    const hasBreakpoints = xs !== undefined || sm !== undefined || md !== undefined || lg !== undefined || xl !== undefined;

    if (size !== undefined) return size as ResponsiveSize;
    if (flex !== undefined && !hasBreakpoints) return 'auto';

    if (hasBreakpoints) {
      return {
        ...(xs !== undefined && { xs }),
        ...(sm !== undefined && { sm }),
        ...(md !== undefined && { md }),
        ...(lg !== undefined && { lg }),
        ...(xl !== undefined && { xl }),
      } as ResponsiveSize;
    }
    return DEFAULT_SIZE;
  }, [size, xs, sm, md, lg, xl, flex]);
}

const useColGridProps = (props: ColBaseProps) => {
  const cleaned = useMemo(
    () => cleanGridProps(props as Record<string, unknown>, 'col') as ColSizeProps & Record<string, unknown>,
    [props],
  );
  const responsiveSize = useResponsiveSize(cleaned);
  const hasBreakpoints = cleaned.xs !== undefined || cleaned.sm !== undefined || cleaned.md !== undefined || cleaned.lg !== undefined || cleaned.xl !== undefined;

  const gridProps = useMemo(() => {
    const p: Record<string, unknown> = {
      size: responsiveSize,
      ...(cleaned.className !== undefined && { className: cleaned.className }),
      ...(cleaned.sx !== undefined && { sx: cleaned.sx }),
    };

    if (cleaned.offset !== undefined) p.offset = cleaned.offset;

    if (cleaned.flex !== undefined && !hasBreakpoints && cleaned.size === undefined) {
      p.style = { ...(cleaned.style as object | undefined), flex: cleaned.flex === true ? 1 : cleaned.flex };
    } else if (cleaned.style !== undefined) {
      p.style = cleaned.style;
    }

    for (const key of Object.keys(cleaned)) {
      if (key.startsWith('data-') || key.startsWith('aria-') || key === 'id') {
        p[key] = cleaned[key];
      }
    }

    return p;
  }, [cleaned, responsiveSize, hasBreakpoints]);

  const itemProps = useMemo(() => {
    const p: Record<string, unknown> = {};
    if (cleaned.style) p.style = cleaned.style;
    if (cleaned.className) p.className = cleaned.className;
    if (cleaned.sx) p.sx = cleaned.sx;
    return p;
  }, [cleaned.className, cleaned.style, cleaned.sx]);

  return { gridProps, itemProps };
};

const ColComponent = (props: ColBaseProps) => {
  const { children } = props;
  const { gridProps, itemProps } = useColGridProps(props);

  return (
    <Grid {...(gridProps as GridProps)}>
      <ItemNoPadding {...itemProps}>{children}</ItemNoPadding>
    </Grid>
  );
};

export const Col = memo(ColComponent);
Col.displayName = 'Col';

const ColPaddedComponent = (props: ColBaseProps) => {
  const { children } = props;
  const { gridProps, itemProps } = useColGridProps(props);

  return (
    <Grid {...(gridProps as GridProps)}>
      <Item {...itemProps}>{children}</Item>
    </Grid>
  );
};

export const ColPadded = memo(ColPaddedComponent);
ColPadded.displayName = 'ColPadded';
