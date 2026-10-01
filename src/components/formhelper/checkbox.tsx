import { memo, useCallback, useMemo } from 'react'
import {
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  FormHelperText,
} from '@mui/material'
import { color } from '../../theme-material'
import { useFormField, UseFormFieldProps } from './form-provider'
import { useCleanParentProps } from './helper/clean-parent-props'
import { pickColLayoutProps } from './helper/clean-grid-props'
import { Info } from './info'
import { ColPadded } from '../grid'
import { isTruthy } from '../../utils/is-truthy'
import type { FormControlProps } from './control-props'

export type CheckboxProps = UseFormFieldProps &
  FormControlProps & {
    variant?: 'h1' | 'h2' | 'h3' | string
    isChecked?: any
  }

export const Checkbox = memo((props: CheckboxProps) => {
  const variant = props.variant ?? ''
  const { field, readOnly, error, errorMui, identityProps } = useFormField(props)

  const isChecked = useCallback(
    () => isTruthy(field.value ?? props.isChecked),
    [field.value, props.isChecked]
  )

  const labelStyle = useMemo(() => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: '1.2rem',
          fontWeight: 500,
          color: color.primary.blue
        }
      case 'h2':
        return { fontWeight: 400, color: color.primary.blue }
      case 'h3':
        return { fontSize: '.8rem', fontWeight: 300, color: color.primary.blue }
      default:
        return {}
    }
  }, [variant])

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) {
        e.preventDefault()
        return
      }
      field.onChange(e.target.checked)
      props.onChange?.(e as any)
    },
    [field, props.onChange, readOnly]
  )

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      field.onBlur(e.target)
      props.onBlur?.(e as any)
    },
    [field, props.onBlur]
  )

  const parentProps = useCleanParentProps(props, 'checkbox')

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      <MuiFormControlLabel
        disableTypography
        control={
          <MuiCheckbox
            {...identityProps}
            onChange={onChange}
            onBlurCapture={onBlur}
            checked={isChecked()}
            color='success'
            {...parentProps}
            slotProps={{
              ...parentProps.slotProps,
              input: {
                ...parentProps.slotProps?.input,
                readOnly
              }
            }}
          />
        }
        // label={<>&nbsp;{label}</>}
        // style={{ marginLeft: 0 }}
        label={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: '1.2',
              paddingLeft: 10,
              ...labelStyle
            }}
          >
            {props.label ?? ''}
          </span>
        }
        style={{ marginLeft: 0 }}
      />
      {error && (
        <FormHelperText className='Mui-error'>
          {errorMui.helperText}
        </FormHelperText>
      )}
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  )
})

Checkbox.displayName = 'Checkbox'
