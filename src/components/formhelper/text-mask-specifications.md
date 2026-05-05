for testing, use the command npm run test:commit. 

specifications for  text-mask, text-partial mask. 

has all the existing functionality of text-field.

the control should allow for:
-patterned input
-data masking of values
-optional partial masking, the last n characters visible. 


when the control is loaded with no data, 
-it should be unmasked
-it should be ready for editing
-it should display the default placeholder or attribute placeholder


when the control is loaded with data
-it should be masked or partially masked
-not allow keyboard input. 

when the control is unmasked and remasked
-it should display the mask or partial mask with the same last n characters visible as when it is initialized with data. 

in addition, for the common mask patterns
-add an export of maskPattern so that things like 
<Input name="whatever" 
  mask={maskPattern.ssn}
>


