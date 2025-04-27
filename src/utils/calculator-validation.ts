export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateNumber(value: string | number, fieldName: string): ValidationError | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid number`
    };
  }
  
  if (num < 0) {
    return {
      field: fieldName,
      message: `${fieldName} cannot be negative`
    };
  }
  
  return null;
}

export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (value === undefined || value === null || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`
    };
  }
  return null;
}

export function validateRange(
  value: number,
  fieldName: string,
  min: number,
  max: number
): ValidationError | null {
  if (value < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${min}`
    };
  }
  
  if (value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be at most ${max}`
    };
  }
  
  return null;
}

export function validatePercentage(value: number, fieldName: string): ValidationError | null {
  return validateRange(value, fieldName, 0, 100);
}

export function validateInputs(
  inputs: Record<string, any>,
  validators: Record<string, ((value: any) => ValidationError | null)[]>
): ValidationResult {
  const errors: ValidationError[] = [];
  
  Object.entries(validators).forEach(([field, fieldValidators]) => {
    fieldValidators.forEach(validator => {
      const error = validator(inputs[field]);
      if (error) {
        errors.push(error);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 