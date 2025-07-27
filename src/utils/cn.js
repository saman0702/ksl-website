import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitaire pour combiner et fusionner les classes Tailwind CSS
 * @param {...any} inputs - Classes CSS à combiner
 * @returns {string} Classes CSS fusionnées
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 