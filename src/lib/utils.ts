import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


//export const BASE_URL = "http://13.60.185.201:3001/api/v1";
export const BASE_URL = "http://localhost:3001/api/v1";