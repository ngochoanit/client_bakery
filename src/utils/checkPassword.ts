// password must contain at least one digit, lowercase letters, uppercase and special characters
export const checkPassword = (password: string) => {
  if (password.length < 6) {
    return {
      status: false,
      message: 'Password must be at least 6 characters',
    };
  }
  if (!/\d/.test(password)) {
    return {
      status: false,
      message: 'Password must contain at least one digit',
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      status: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      status: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      status: false,
      message: 'Password must contain at least one special character',
    };
  }
  return {
    status: true,
  };
};
