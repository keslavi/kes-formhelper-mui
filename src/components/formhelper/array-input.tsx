import { useFieldArray } from 'react-hook-form';
import { useFormContext } from './form-provider';
import { Col } from '../grid/col';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MuiTextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export interface ArrayInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  info?: string;
  size?: number | string;
  disabled?: boolean;
}

export const ArrayInput = (props: ArrayInputProps) => {
  const {
    name,
    label,
    placeholder = '',
    info,
    size = 12,
    disabled = false,
  } = props;

  const { formMethods } = useFormContext();
  const { control, formState: { errors } } = formMethods;
  const { fields, append, remove } = useFieldArray({ control, name });

  const error = (errors as any)?.[name];

  return (
    <Col size={size as any}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {label && (
            <label style={{ marginRight: 8, fontWeight: 500 }}>{label}</label>
          )}
          {info && <span title={info} style={{ marginLeft: 4, cursor: 'help', color: '#666' }}>ⓘ</span>}
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append('')}
            disabled={disabled}
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
              size="small"
              disabled={disabled}
              error={!!(error && (errors as any)?.[name]?.[index])}
              helperText={(errors as any)?.[name]?.[index]?.message}
            />
            <IconButton
              type="button"
              color="error"
              onClick={() => remove(index)}
              disabled={disabled}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {error && typeof error.message === 'string' && (
          <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
            {error.message}
          </Box>
        )}
      </Box>
    </Col>
  );
};

ArrayInput.displayName = 'ArrayInput';
