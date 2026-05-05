# @wsc/formhelper-mui

Form helper components for MUI built on react-hook-form.

## Install

```bash
npm install @wsc/formhelper-mui
```

## Peer dependencies

This package expects these to be installed by the consuming app:

- react, react-dom
- @mui/material, @mui/icons-material, @mui/lab, @mui/x-date-pickers, @mui/x-data-grid
- @emotion/react, @emotion/styled
- react-hook-form

## Usage

```tsx
import {
	FormProvider,
	TextField,
	Select,
	ThemeProvider,
	theme,
} from '@wsc/formhelper-mui';

export function ExampleForm() {
	return (
		<ThemeProvider theme={theme}>
			<FormProvider>
				<TextField name="title" label="Title" />
				<Select name="status" label="Status" options={[{ label: 'Open', value: 'open' }]} />
			</FormProvider>
		</ThemeProvider>
	);
}
```

## Build

```bash
npm run build
```
