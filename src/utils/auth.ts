import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
  const salt = 10
  return await bcrypt.hash(password, salt)
}

export const comparePassword = async (inputPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(inputPassword, hashedPassword)
}