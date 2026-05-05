import { AppBar, Box, Toolbar } from '@mui/material';
import { color } from '../../theme-material';
import type { ReactNode, CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface NavStickyProps {
  children?: ReactNode;
  /**
   * Distance from the top of the viewport — should equal the height of the
   * primary fixed AppBar sitting above this bar.
   * MUI dense Toolbar = 48px; standard Toolbar = 64px.
   * @default '48px'
   */
  top?: string | number;
  /**
   * Background color of the sticky bar.
   * @default color.primary.white
   */
  bgcolor?: string;
  /**
   * Show a bottom border separating this bar from page content.
   * @default true
   */
  divider?: boolean;
  /**
   * MUI AppBar elevation (box-shadow depth). 0 = flat / no shadow.
   * @default 0
   */
  elevation?: number;
  /**
   * z-index. Should be below the primary AppBar (MUI default appBar = 1100)
   * but above page content.
   * @default 1099
   */
  zIndex?: number;
  /**
   * Horizontal padding inside the Toolbar.
   * @default 2
   */
  px?: number | string;
  /** Additional sx overrides applied to the outer AppBar. */
  sx?: SxProps<Theme>;
  style?: CSSProperties;
}

/**
 * A secondary sticky bar that renders just below the primary fixed AppBar.
 *
 * Typical usage — place a row of action buttons (save, continue, etc.) that
 * should stay visible as the user scrolls a long form:
 *
 * ```tsx
 * <NavSticky>
 *   <Button variant="contained" onClick={onSave}>Save</Button>
 *   <Button variant="outlined" onClick={onCancel}>Cancel</Button>
 * </NavSticky>
 * <NavSticky.Spacer />     {/* reserves the height so content isn't hidden * /}
 *
 * // … page content …
 * ```
 *
 * The `top` prop must match the rendered height of whatever fixed AppBar sits
 * above it (usually your app's main Header).  MUI dense Toolbar renders at 48px;
 * standard at 64px.
 */
export const NavSticky = ({
  children,
  top = '48px',
  bgcolor = color.primary.white,
  divider = true,
  elevation = 0,
  zIndex = 1099,
  px = 2,
  sx,
  style,
}: NavStickyProps) => (
  <AppBar
    position="fixed"
    elevation={elevation}
    style={style}
    sx={{
      top,
      bgcolor,
      zIndex,
      boxShadow: elevation === 0 ? 'none' : undefined,
      borderBottom: divider ? `1px solid ${color.gray300}` : 'none',
      ...sx,
    }}
  >
    <Toolbar
      disableGutters
      variant="dense"
      sx={{ px, bgcolor, minHeight: '40px' }}
    >
      {children}
    </Toolbar>
  </AppBar>
);

// ── NavSticky.Spacer ──────────────────────────────────────────────────────────

interface SpacerProps {
  /**
   * Height to reserve — should match the NavSticky bar's rendered height.
   * @default '40px'
   */
  height?: string | number;
  /**
   * Additional gap below the spacer block.
   * @default '8px'
   */
  gap?: string | number;
}

/**
 * Companion spacer — prevents page content from being hidden under the fixed
 * NavSticky bar.  Place it immediately after `<NavSticky>` in the render tree.
 *
 * ```tsx
 * <NavSticky>...</NavSticky>
 * <NavSticky.Spacer />
 * <MyPageContent />
 * ```
 */
NavSticky.Spacer = ({ height = '40px', gap = '8px' }: SpacerProps) => (
  <Box sx={{ height, mb: gap }} aria-hidden="true" />
);

export default NavSticky;
