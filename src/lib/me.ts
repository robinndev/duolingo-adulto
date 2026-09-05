"use client";

const KEY_ID = "mePlayerId";
const KEY_NAME = "meName";

export function getMe(): { id: string; name: string } | null {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem(KEY_ID);
  const name = localStorage.getItem(KEY_NAME);
  if (!id || !name) return null;
  return { id, name };
}

export function setMe(id: string, name: string) {
  localStorage.setItem(KEY_ID, id);
  localStorage.setItem(KEY_NAME, name);
}

export function clearMe() {
  localStorage.removeItem(KEY_ID);
  localStorage.removeItem(KEY_NAME);
}
