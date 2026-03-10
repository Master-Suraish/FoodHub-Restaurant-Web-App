import bcrypt from "bcrypt";


export function hashing(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export function comparePassword(password: string, hashedPasswword: string) {
  return bcrypt.compare(password, hashedPasswword);
}
