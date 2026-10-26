import bcryptjs from "bcryptjs";

export const encryptPass = (value) => {
  const salt = bcryptjs.genSaltSync(10);
  const hashValue = bcryptjs.hashSync(String(value), salt);
  return hashValue;
};

export const decryptPass = (oldValue, dataValue) => {
  const valid = bcryptjs.compareSync(oldValue, dataValue);
  return valid;
};
