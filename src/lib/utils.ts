import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Converte texto de input livre (ex: "1.500,00") em number. Retorna 0 se inválido. */
export function parseLooseNumber(v: string): number {
  const n = Number(v.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}
