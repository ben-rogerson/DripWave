import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

/**
 * Merge Tailwind and clsx classes
 * @param inputs - Tailwind and clsx classes
 * @returns Merged classes
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
