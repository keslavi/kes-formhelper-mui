# kes-formhelper-mui

Form helper components for MUI built on react-hook-form.

## Install

```bash
npm install kes-formhelper-mui
```

## Peer dependencies

This package expects these to be installed by the consuming app:

- react, react-dom (>=18)
- @mui/material, @mui/icons-material (^9)
- @emotion/react, @emotion/styled
- react-hook-form (>=7)

Validation resolvers (yup, zod, etc.) and `@hookform/resolvers` are optional and supplied by the host app.

## Usage

```tsx
import {
	FormProvider,
	TextField,
	Select,
	ThemeProvider,
	theme,
} from 'kes-formhelper-mui';

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
