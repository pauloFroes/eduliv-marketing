import bcrypt from "bcrypt";

const BCRYPT_COST = Number(process.env.BCRYPT_COST);
if (!BCRYPT_COST) throw new Error("BCRYPT_COST is not set");

export const pwdCrypt = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, BCRYPT_COST);
};

export const pwdVerify = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
