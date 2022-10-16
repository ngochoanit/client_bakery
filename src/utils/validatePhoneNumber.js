const validatePhoneNumber = (value) => {
  return value.match(/\d/g).length === 10;
};

export default validatePhoneNumber;
