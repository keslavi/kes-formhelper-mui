// Library entry point

// Styles
import './css/index.css';

// Theme
export {
  color,
  fontWeights,
  baseThemeOptions,
  createAppTheme,
  theme,
  ThemeProvider,
  StyledAccordionSummary,
} from './theme-material';

// Grid
export {
  Col,
  ColPadded,
  Container,
  ContainerFullWidth,
  Item,
  ItemNoPadding,
  Row,
  TableRows,
  RowHeader,
  RowSubheader,
} from './components/grid';

// Components
export { Fieldset } from './components/fieldset';
export type { FieldsetProps } from './components/fieldset';
export { Icon, iconType } from './components/icon';
export { LabelMask } from './components/label-mask';
export { ModalCommon, ModalConfirmExit } from './components/modal';
export { NavSticky } from './components/nav-sticky';
export type { NavStickyProps } from './components/nav-sticky';
export { Navbar } from './components/navbar';
export { TextareaDebug } from './components/textarea-debug';

// Formhelper
export {
  useRealController,
  useFormProvider,
  FormProvider,
  useController,
  useFormContext,
  useFormField,
  Label,
  Info,
  InfoIcon,
  TextField,
  Password,
  CharCount,
  Checkbox,
  Radio,
  Select,
  SelectMulti,
  SelectAutocomplete,
  SelectCheckbox,
  Textarea,
  Datepicker,
  DateMask,
  TextMask,
  ArrayInput,
  Input,
  maskPattern,
  cleanParentProps,
  colProps,
} from './components/formhelper';
export type {
  FormProviderProps,
  UseFormFieldProps,
  UseFormFieldReturn,
  LabelProps,
  InfoObject,
  InfoValue,
  InfoProps,
  InfoIconProps,
  TextFieldProps,
  PasswordProps,
  CharCountProps,
  CheckboxProps,
  RadioOption,
  RadioProps,
  SelectOption,
  SelectProps,
  SelectMultiOption,
  SelectMultiProps,
  SelectAutocompleteOption,
  SelectAutocompleteProps,
  SelectCheckboxOption,
  SelectCheckboxProps,
  TextareaProps,
  DatepickerProps,
  DateMaskProps,
  TextMaskProps,
  ArrayInputProps,
  InputProps,
} from './components/formhelper';

// Utilities
export { isEmpty } from './utils/is-empty';
export { isTruthy, isFalsy } from './utils/is-truthy';

