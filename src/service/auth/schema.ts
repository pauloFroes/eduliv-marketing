import { z } from "zod";
import { schemaUserEmail, schemaUserPassword } from "../schema";

export const schemaAuthVerifyUserIdToken = z.undefined();

export const schemaAuthLogout = z.undefined();

export const schemaAuthLogin = z.object({
  email: schemaUserEmail,
  password: schemaUserPassword,
});
