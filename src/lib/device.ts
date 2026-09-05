"use client";
import { getMe } from "./me";

const KEY = "deviceLabel";

export function getDeviceLabel(): string {
  if (typeof window === "undefined") return "";
  const cached = localStorage.getItem(KEY);
  const me = getMe();
  if (cached && (!me || cached.startsWith(me.name))) return cached;

  const ua = navigator.userAgent;
  let device = "Dispositivo";
  if (/iPhone/i.test(ua)) device = "iPhone";
  else if (/iPad/i.test(ua)) device = "iPad";
  else if (/Android/i.test(ua)) device = "Android";
  else if (/Macintosh/i.test(ua)) device = "Mac";
  else if (/Windows/i.test(ua)) device = "Windows";

  const rand = Math.random().toString(36).slice(2, 6);
  const label = me ? `${me.name}-${device}-${rand}` : `${device}-${rand}`;
  localStorage.setItem(KEY, label);
  return label;
}
