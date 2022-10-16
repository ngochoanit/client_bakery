const validateMessages = {
  default: (name: string) => `${name} is not a valid`,
  required: (name: string) => `${name} is required`,
  whitespace: (name: string) => `${name} without spaces`,
  whitespaceFirst: (name: string) => `${name} does not start with a space`,
  stringMinLength: (name: string, min: number) =>
    `${name} must be at least ${min} characters`,
  stringMaxLength: (name: string, max: number) =>
    `${name} cannot be longer than ${max} characters`,
  numberRange: (name: string, min: number, max: number) =>
    `Range: ${name} must be between ${min} and ${max}`,
  numberRangeThan: (name: string, min: number, max: number) =>
    `Range: ${name} must be greater than ${min} and less than ${max}`,
  pattern: (name: string, pattern: string) =>
    `${name} does not match pattern ${pattern}`,
};
export default validateMessages;
