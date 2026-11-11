# kes-react-formhelper

Form helper components for MUI built on react-hook-form.

## Install

```bash
npm install kes-react-formhelper
```

## Peer dependencies

This package expects these to be installed by the consuming app:

- react, react-dom (>=18)
- @mui/material, @mui/icons-material (^9)
- @emotion/react, @emotion/styled
- react-hook-form (>=7)

Validation resolvers (yup, zod, etc.) and `@hookform/resolvers` are optional and supplied by the host app.

## Tests

Run `npm run test-once` for the unit tests. GitHub Actions runs the same command
on pushes and pull requests. The `main` and `dev` branches require the
`Unit tests` check; repository administrators can bypass this protection.
After `npm install`, Husky also runs the unit tests before each local commit.

## Usage

```tsx
import {
	FormProvider,
	TextField,
	Select,
	ThemeProvider,
	theme,
} from 'kes-react-formhelper';

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
