"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from "@/lib/admin-auth";
import { addTrackingEvent } from "@/lib/data/orders";
import type { TrackingStage } from "@/types";

export async function loginAdminAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/orders");
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

async function requireAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function addTrackingEventAction(
  reference: string,
  stage: TrackingStage,
  note: string
): Promise<{ error?: string; success?: boolean }> {
  const authed = await requireAdminSession();
  if (!authed) {
    return { error: "Session expired. Please sign in again." };
  }

  try {
    await addTrackingEvent(reference, stage, note || undefined);
  } catch (err) {
    console.error("[admin] Failed to add tracking event:", err, { reference, stage });
    return { error: "Failed to save the update. Please try again." };
  }

  revalidatePath(`/admin/orders/${reference}`);
  revalidatePath("/admin/orders");
  return { success: true };
}
