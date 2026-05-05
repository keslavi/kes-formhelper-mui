// https://mui.com/material-ui/customization/theming/
// https://mui.com/material-ui/customization/theme-components/

import { createTheme, ThemeProvider as MuiThemeProvider, styled } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AccordionSummary } from '@mui/material';
import React from 'react';

/*
  Colors are expressed as CSS custom property references: var(--token, fallback)
  The consuming app overrides tokens by redefining them in its own :root {}.
  No getComputedStyle — values resolve at paint time in the browser.
*/

export const color = {
  primary: {
    blue: 'var(--color-primary, #012169)',
    red: 'var(--color-primary-light, #0241ce)',
    white: 'var(--color-white, #ffffff)',
    header: 'var(--color-header, #012169)',
    backgroundColor: 'var(--color-white, #ffffff)',
    black: 'var(--color-black, #000000)',
    gray: 'var(--color-gray-600, #757575)',
    grey: 'var(--color-gray-600, #757575)',
    disabled: 'var(--color-disabled, #eeeeee)',
  },
  secondary: {
    blue300: 'var(--color-blue-300, #cee0ea)',
    blue550: 'var(--color-blue-550, #0053c2)',
    blue600: 'var(--color-blue-600, #2741a3)',
    blue700: 'var(--color-blue-700, #0241ce)',
    blue950: 'var(--color-blue-950, #012169)',
    blueShade: 'var(--color-blue-100, #e6e9f1)',
    almostBlack: 'var(--color-gray-800, #504f54)',
    grey500: 'var(--color-gray-100, #eeebe8)',
    almostGray: 'var(--color-gray-700, #7a7878)',
    almostGrey: 'var(--color-gray-700, #7a7878)',
    black: 'var(--color-black, #000000)',
    shaded: 'var(--color-shaded, #f8f8f8)',
  },
  cobe1: {
    blue: 'var(--color-cobe1-blue, #0073cf)',
    black: 'var(--color-cobe1-black, #333333)',
    white: 'var(--color-white, #ffffff)',
    gray: 'var(--color-cobe1-gray, #9d8e80)',
    grey: 'var(--color-cobe1-gray, #9d8e80)',
    red: 'var(--color-cobe1-red, #d32f2f)',
    lightGray: 'var(--color-cobe1-light-gray, #c1c9c0)',
  },
  white: 'var(--color-white, #ffffff)',
  bodyBackGround: 'var(--color-body-background, #fafafa)',
  gray300: 'var(--color-gray-300, #e0e0e0)',
  headingColor: 'var(--color-header, #012169)',
  headingColorSecondary: 'var(--color-header-secondary, #000000)',
  link: 'var(--color-link, #0053c2)',
} as const;

export const fontWeights = {
  bold: 'var(--font-weight-bold, 700)',
  boldish: 'var(--font-weight-boldish, 500)',
  regular: 'var(--font-weight-regular, 400)',
  light: 'var(--font-weight-light, 300)',
} as const;

/**
 * Extracts the hex fallback from a CSS custom property string.
 * MUI palette requires parseable color values — var() refs are only valid
 * as raw CSS (sx props, styleOverrides). Use hex() in palette definitions.
 * e.g. hex('var(--color-primary, #012169)') → '#012169'
 */
function hex(cssVar: string): string {
  const m = cssVar.match(/,\s*(#[0-9a-fA-F]{3,8})\s*\)/);
  return m ? m[1] : cssVar;
}

const init = createTheme();

/** Plain options object — spread and override in your own createTheme() call.
 *  Note: cssVariables is omitted so palette values stay as hex for MUI's JS style
 *  code (e.g. alpha()). Enable in app if needed: createTheme({ ...baseThemeOptions, cssVariables: true })
 */
export const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "Connections, Roboto, Calibri, 'sans-serif'",
    fontSize: 16,
    body2: {
      fontFamily: "Connections, Roboto, Calibri, 'sans-serif'",
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  palette: {
    primary: { main: hex(color.primary.blue) },
    secondary: { main: hex(color.primary.red) },
    background: { default: hex(color.bodyBackGround), paper: hex(color.white) },
  },
  zIndex: { appBar: 4000, modal: 4001 },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: hex(color.primary.blue) },
        secondary: { main: hex(color.primary.red) },
        text: { disabled: hex(color.secondary.almostGrey) },
      },
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          '>.MuiPaper-root': { paddingLeft: '0px' },
          '>.MuiFormControl-root': { paddingLeft: '1rem' },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          marginTop: init.spacing(2),
          marginBottom: init.spacing(2),
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          position: 'relative',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          border: `1px solid ${color.cobe1.grey}`,
          padding: '15px',
          fontSize: '14px',
          color: color.cobe1.black,
          '& .MuiTypography-h5': { fontSize: '1.2rem' },
        },
      },
    },
    MuiDialogContentText: { styleOverrides: { root: {} } },
    MuiAppBar: {
      styleOverrides: { root: { backgroundColor: color.bodyBackGround } },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          '&.MuiAlert-colorError': { '& .MuiSvgIcon-root': { color: color.cobe1.red } },
          '& .MuiTypography-root': { paddingLeft: '0px' },
          svg: { color: color.cobe1.black },
        },
      },
    },
    MuiAccordion: {},
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: color.primary.white,
          border: `1px solid ${color.secondary.grey500}`,
        },
      },
      variants: [
        { props: { variant: 'noborder' }, style: { border: `1px solid ${color.primary.white}` } } as any,
      ],
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: color.primary.white,
          color: color.primary.blue,
          fontSize: '1.2rem',
          fontWeight: '500',
          padding: '2px',
          paddingLeft: '0.5rem',
          border: `1px solid ${color.secondary.grey500}`,
          minHeight: 32,
          margin: '0px',
          '& .MuiAccordionSummary-expandIconWrapper': { alignSelf: 'start', marginTop: '16px' },
          '& .Mui-expanded': { alignSelf: 'start', marginTop: '24px' },
          '& .MuiSvgIcon-root': { color: color.cobe1.grey },
        },
      },
      variants: [
        { props: { variant: 'noborder' }, style: { border: `1px solid ${color.primary.white}` } } as any,
      ],
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& input[type='hidden']+fieldset": { display: 'none' },
        },
      },
      variants: [
        { props: { variant: 'noborder' }, style: { border: `1px solid ${color.primary.white}` } } as any,
      ],
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          width: '20px',
          height: '20px',
          color: color.cobe1.lightGray,
          marginLeft: '-0.375rem',
          '&.Mui-checked': { color: color.cobe1.blue },
          '&:hover': { color: color.cobe1.blue },
          'ul.MuiAutocomplete-listbox li.MuiAutocomplete-option &': {
            '&:hover': { color: color.cobe1.white },
          },
          'ul.MuiAutocomplete-listbox li.MuiAutocomplete-option[aria-selected="true"] &': {
            color: color.cobe1.white,
          },
          'ul.MuiAutocomplete-listbox li.MuiAutocomplete-option &.Mui-checked': {
            color: color.cobe1.blue,
          },
          'ul.MuiAutocomplete-listbox li.MuiAutocomplete-option &.Mui-checked[aria-selected="true"]': {
            color: color.cobe1.white,
          },
        },
      },
    },
    MuiListItem: {},
    MuiDivider: {
      styleOverrides: {
        root: {
          borderBottomWidth: 1,
          paddingBottom: 0,
          borderColor: color.gray300,
        },
      },
    },
    MuiIconButton: {},
    MuiFormControl: {
      styleOverrides: {
        root: {
          display: 'flex',
          position: 'relative',
          '.MuiFormLabel-root': {
            fontFamily: 'Connections, Roboto, Calibri, sans-serif',
          },
          '.MuiInputBase-input': {
            padding: '8px 12px !important',
            height: 'auto !important',
            minHeight: '40px',
            lineHeight: '1.2',
            boxSizing: 'border-box',
          },
          '.MuiInputBase-root': { minHeight: 'auto' },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: '0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          width: 'fit-content',
          input: { position: 'relative' },
          '&:has(.MuiRadio-root)': { marginBottom: '0.5rem', marginRight: '1rem', gap: '0.5rem' },
          '.MuiTypography-root': { paddingLeft: '10px' },
          '.PrivateSwitchBase-input': { height: '20px', width: '20px' },
          '&.Mui-disabled': {
            color: color.cobe1.lightGray,
            '.MuiTypography-root': { color: color.cobe1.lightGray },
            '.MuiSvgIcon-root': { color: color.cobe1.lightGray },
          },
        },
      },
      variants: [
        {
          props: { variant: 'h1' },
          style: { fontSize: '1.2rem', color: color.primary.blue, fontWeight: 500 },
        } as any,
      ],
    },
    MuiTypography: {
      styleOverrides: { root: { paddingLeft: '10px' } },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '&.MuiAutocomplete-hasClearIcon.MuiAutocomplete-hasPopupIcon': {
            '.MuiOutlinedInput-root': { paddingRight: '0px' },
          },
          '& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot': {
            minHeight: '32px',
            paddingTop: '0px',
            paddingBottom: '0px',
            alignItems: 'center',
          },
          '& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot .MuiOutlinedInput-input.MuiAutocomplete-input': {
            padding: '4px 35px 4px 5px !important',
            minHeight: '26px',
            boxSizing: 'border-box',
          },
        },
        inputRoot: {
          padding: '0px',
          alignItems: 'center',
          '.MuiInputBase-input:hover, .MuiInputBase-input:focus, .MuiAutocomplete-input:hover, .MuiAtuocomplete-input:focus': {
            paddingRight: '60px !important',
            // padding: '0px 35px 0px 5px',
            // height: '1.4375em',
            // '&:hover': { paddingRight: '60px' },
            // '&:focus': { paddingRight: '60px' },
          },
        },
        listbox: {
          borderTop: `1px solid ${color.cobe1.lightGray}`,
          borderRight: `1px solid ${color.cobe1.lightGray}`,
          borderBottom: `1px solid ${color.cobe1.lightGray}`,
          borderLeft: `1px solid ${color.cobe1.lightGray}`,
          padding: '0px',
          background: color.cobe1.white,
          '.MuiAutocomplete-option.Mui-focused': {
            color: color.cobe1.white,
            backgroundColor: color.cobe1.blue,
          },
          '.MuiAutocomplete-option[aria-selected="true"].Mui-focused': {
            backgroundColor: color.cobe1.blue,
            color: color.cobe1.white,
          },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: { shrink: false },
      styleOverrides: {
        root: {
          zIndex: 2,
          position: 'relative',
          transform: 'none',
          marginBottom: '4px',
          fontSize: '13px',
          backgroundColor: 'transparent',
          padding: '0',
          '&.MuiInputLabel-shrink': { transform: 'none', backgroundColor: 'transparent', padding: '0' },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: '0px',
          width: '20px',
          height: '20px',
          color: color.cobe1.lightGray,
          '&.Mui-checked': { color: color.cobe1.blue },
          '&.Mui-checked.Mui-disabled': { color: color.cobe1.lightGray },
          '&:hover': { color: color.cobe1.blue },
        },
      },
      variants: [
        {
          props: { variant: 'regular' }, style: { fontWeights: fontWeights.regular },
        } as any,
        {
          props: { variant: 'dark' }, style: {
            color: color.primary.blue,
            '&:hover': { color: color.link },
          }
        }, {
          props: { variant: 'current' }, style: {
            color: color.secondary.blue550,
            '&:hover': { 
              color: color.secondary.blue550,
              textDecoration: 'underline',
            },
          } as any
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          alignSelf: 'flex-start',
          '& .MuiInputBase-root': { minHeight: 'auto' },
          '& .MuiOutlinedInput-root:has(input[readonly])': {
            backgroundColor: 'transparent',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
              flexShrink: 0,
            },
            '& .MuiOutlinedInput-input': {
              paddingLeft: '0px !important',
              paddingRight: '0px !important',
              cursor: 'text',
            },
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: { root: { margin: '5px' } },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: color.cobe1.black,
          fontSize: '14px',
          '&.Mui-focused': { color: color.cobe1.black },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          display: 'flex',
          padding: '0px',
          minHeight: '32px',
          alignItems: 'center',
          '& .MuiOutlinedInput-notchedOutline legend': { display: 'none' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: `1px solid ${color.cobe1.blue}`,
          },
        },
        input: {
          padding: '4px 8px !important',
          height: 'auto !important',
          minHeight: '26px',
          lineHeight: '1.2',
          boxSizing: 'border-box',
        },
      },
    },
    MuiDrawer: {},
    MuiToolbar: {},
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': { backgroundColor: color.secondary.shaded },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: color.primary.blue,
          color: color.primary.white,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: { fontWeight: 'bold', color: color.primary.header },
        cell: { color: color.primary.black },
        sortIcon: { color: color.primary.blue, opacity: 1 },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'none' },
      styleOverrides: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        root: ({ ownerState }: any) => ({
          cursor: 'pointer',
          fontWeight: fontWeights.bold,
          color: color.secondary.blue550,
          ...(ownerState.underline === 'hover' && {
            textDecoration: 'none',
            '&:hover, &:focus-visible': {
              textDecoration: 'underline',
              color: color.secondary.blue950,
            },
          }),
        }),
      },
      variants: [
        { props: { variant: 'regular' }, style: { fontWeight: fontWeights.regular } } as any,
        {
          props: { variant: 'dark' },
          style: {
            color: color.primary.blue,
            '&:hover': { color: color.link },
          },
        } as any,
        {
          props: { variant: 'current' },
          style: {
            color: color.secondary.blue550,
            '&:hover': { color: color.secondary.blue550, textDecoration: 'underline' },
          },
        } as any,
      ],
    },
    MuiListItemText: {
      styleOverrides: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        root: ({ ownerState }: any) => {
          const fw = ownerState.bold ? 700 : ownerState.boldish ? 500 : ownerState.light ? 300 : undefined;
          return {
            '& .MuiListItemText-primary': { fontWeight: 400 },
            ...(ownerState.bold && { '& .MuiListItemText-primary': { fontWeight: fw } }),
            ...(ownerState.boldish && { '& .MuiListItemText-primary': { fontWeight: fw } }),
            ...(ownerState.light && { '& .MuiListItemText-primary': { fontWeight: fw } }),
          };
        },
      },
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'tag' },
          style: {
            borderRadius: '0.25rem',
            background: '#E5F1FA',
            color: color.link,
            margin: '4px',
            minHeight: '24px',
            maxHeight: '24px',
          },
        } as any,
      ],
    },
  } as ThemeOptions['components'],
};

/**
 * Factory — call with your own overrides to get a full MUI theme.
 * @example
 *   const myTheme = createAppTheme({ palette: { primary: { main: '#ff0000' } } });
 */
export function createAppTheme(overrides: ThemeOptions = {}): ReturnType<typeof createTheme> {
  return createTheme(baseThemeOptions, overrides);
}

/** Default theme instance — used by Storybook and drop-in consumers */
export const theme = createAppTheme();

/** Pre-built ThemeProvider wrapper — apply and done */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);

export default ThemeProvider;

export const StyledAccordionSummary = styled(AccordionSummary)({
  minHeight: 30,
  maxHeight: 30,
  '&.Mui-expanded': { minHeight: 30, maxHeight: 30 },
  fontSize: '1.2rem',
  padding: '2px',
  paddingLeft: '0.5rem',
  border: '1px solid white',
});
