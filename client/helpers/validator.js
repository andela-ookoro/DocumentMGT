export const validateName = ((name) => {
  const regex = /^[a-zA-Z ]{2,30}$/;
  if (regex.test(name)) {
    return true;
  }
  return 'Please input between 2 to 30 alphabets only';
});

export const validateEmail = ((email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (regex.test(email)) {
    return true;
  }
  return 'Please input a valid email address';
});

export const validatePassword = ((password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (regex.test(password)) {
    return true;
  }
  return 'Password should contain atleast a number and a special character';
});

export const validateRoleId = ((roleId) => {
  const regex = /^[0-9]+$/;
  if (regex.test(roleId)) {
    return true;
  }
  return 'Please select your role';
});

