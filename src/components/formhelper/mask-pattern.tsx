




/** Predefined mask patterns. # = digit, A = letter, * = any */
export const maskPattern: Record<string, string> = {
  ein: '##-#######',
  ssn: '###-##-####',
  phone: '(###) ###-####',
  phoneExt: '(###) ###-#### x####',
  creditCard: '#### #### #### ####',
  creditCardExpiry: '##/##',
  zipCode: '#####',
  zipCodePlus4: '#####-####',
  date: '##/##/####',
  time: '##:##',
  currency: '$#,###.##',
  percentage: '##%',
  licensePlate: 'AAA-####',
};