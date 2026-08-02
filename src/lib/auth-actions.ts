"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword, createSession, destroySession } from "./auth.server";
import { getUserByEmail, createUser } from "./users.server";

export interface AuthResult {
  error?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUpAction(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (!name) return { error: "Name is required." };
  if (!isValidEmail(email)) return { error: "Enter a valid email address." };
  if (input.password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await getUserByEmail(email);
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await hashPassword(input.password);
  const user = await createUser(email, passwordHash, name);
  await createSession({ userId: user.id, email: user.email });
  redirect("/");
}

export async function signInAction(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const user = await getUserByEmail(email);
  // Same generic error whether the email is unknown or the password is wrong —
  // don't leak which one it was.
  if (!user) return { error: "Invalid email or password." };

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) return { error: "Invalid email or password." };

  await createSession({ userId: user.id, email: user.email });
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
