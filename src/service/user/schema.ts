import { z } from "zod";
import {
  schemaUserEmail,
  schemaUserPassword,
  schemaUserFullName,
} from "../schema";

export const schemaUserCreate = z.object({
  fullName: schemaUserFullName,
  email: schemaUserEmail,
  password: schemaUserPassword,
});

export const schemaUserGetByToken = z.undefined();
