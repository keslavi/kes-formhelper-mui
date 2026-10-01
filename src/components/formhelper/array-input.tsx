import { useFieldArray } from 'react-hook-form';
import { useFormContext } from './form-provider';
import { collectFieldErrorMessages, renderFieldErrorMessages } from './helper/field-errors';
import { Col } from '../grid/col';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MuiTextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Info } from './info';
import type { FormControlProps, TextEntryProps } from './control-props';

export interface ArrayInputProps extends FormControlProps, TextEntryProps {
  name: string;
}

export const ArrayInput = (props: ArrayInputProps) => {
  const {
    name,
    label,
    placeholder = '',
    info,
    size = 12,
    disabled = false,
    maxLength,
    minLength,
  } = props;

  const { formMethods, readOnly: providerReadOnly } = useFormContext();
  const readOnly = props.readOnly ?? providerReadOnly ?? false;
  const locked = disabled || readOnly;
  const { control, formState: { errors } } = formMethods;
  const { fields, append, remove } = useFieldArray({ control, name });

  const error = (errors as any)?.[name];
  const arrayErrorMessages = collectFieldErrorMessages(error);
  const itemErrorMessages = (index: number) =>
    collectFieldErrorMessages((errors as any)?.[name]?.[index]);

  return (
    <Col size={size}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pr: info ? 4 : 0 }}>
          {label && (
            <label style={{ marginRight: 8, fontWeight: 500 }}>{label}</label>
          )}
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append('')}
            disabled={locked}
            sx={{ ml: 'auto' }}
          >
            Add
          </Button>
        </Box>

        {fields.length === 0 && (
          <Box sx={{ fontStyle: 'italic', color: 'text.secondary', p: 1 }}>
            No items added yet. Click "Add" to add a new item.
          </Box>
        )}

        {fields.map((field, index) => (
          <Box key={field.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
            <MuiTextField
              {...control.register(`${name}.${index}`)}
              placeholder={placeholder}
              fullWidth
              size={props.sizeInput}
              disabled={disabled}
              error={itemErrorMessages(index).length > 0}
              helperText={renderFieldErrorMessages(itemErrorMessages(index))}
              slotProps={{
                htmlInput: {
                  readOnly,
                  maxLength,
                  minLength,
                },
              }}
            />
            <IconButton
              type="button"
              color="error"
              onClick={() => remove(index)}
              disabled={locked}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {arrayErrorMessages.length > 0 && (
          <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
            {renderFieldErrorMessages(arrayErrorMessages)}
          </Box>
        )}
        {info && <Info id={`${name}Info`} info={info} />}
      </Box>
    </Col>
  );
};

ArrayInput.displayName = 'ArrayInput';
