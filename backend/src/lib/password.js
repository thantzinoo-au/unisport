import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}
