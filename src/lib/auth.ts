import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromToken() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: string;
      username: string;
      email: string;
      createdAt?: string;
      updatedAt?: string;
    };

    return {
      ...decoded,
      createdAt: decoded.createdAt ? new Date(decoded.createdAt) : null,
      updatedAt: decoded.updatedAt ? new Date(decoded.updatedAt) : null,
    };

  } catch {
    return null;
  }
}
