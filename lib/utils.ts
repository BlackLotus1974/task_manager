import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Format date consistently for both server and client to prevent hydration errors
 * @param dateString - ISO date string
 * @returns Formatted date string in MM/DD/YYYY format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Use specific locale to ensure consistency between server and client
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric', 
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}
