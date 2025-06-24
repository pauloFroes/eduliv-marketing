import { cookies } from "next/headers";

export const cookieSet = async (name: string, value: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
  });
};

export const cookieDelete = async (name: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

export const cookieGet = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};
