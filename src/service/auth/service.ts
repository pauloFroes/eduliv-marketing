import { db } from "@/lib/db";
import {
  schemaAuthLogin,
  schemaAuthLogout,
  schemaAuthVerifyUserIdToken,
} from "./schema";
import { AuthLogout, AuthVerifyUserIdToken } from "./types";
import { cookieDelete, cookieGet, cookieSet } from "@/helpers/cookie";
import { jwtSign, jwtVerify } from "@/helpers/jwt";
import { AuthLogin } from "./types";
import { pwdVerify } from "@/helpers/pwd";

export const serviceAuthLogin = async (params: AuthLogin): Promise<boolean> => {
  const paramsValid = schemaAuthLogin.safeParse(params);
  if (!paramsValid.success) return false;
  const { email, password } = paramsValid.data;

  const userDb = await db.user.findUnique({ where: { email } });
  if (!userDb) return false;

  const passwordValid = await pwdVerify(password, userDb.password);
  if (!passwordValid) return false;

  const token = jwtSign({ userId: userDb.id });

  await cookieSet("token", token);

  return true;
};

export const serviceAuthLogout = async (
  params: AuthLogout
): Promise<boolean> => {
  const paramsValid = schemaAuthLogout.safeParse(params);
  if (!paramsValid.success) return false;

  const token = await cookieGet("token");
  if (!token) return false;

  await cookieDelete("token");

  return true;
};

export const serviceAuthVerifyUserIdToken = async (
  params: AuthVerifyUserIdToken
): Promise<boolean> => {
  const paramsValid = schemaAuthVerifyUserIdToken.safeParse(params);
  if (!paramsValid.success) return false;

  const token = await cookieGet("token");
  if (!token) return false;

  const decoded = jwtVerify(token);
  if (!decoded) return false;

  const userDb = await db.user.findUnique({ where: { id: decoded.userId } });
  if (!userDb) return false;

  return true;
};
