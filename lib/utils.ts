import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(startDate: string, endDate?: string): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const start = formatDate(startDate)
  
  if (!endDate) {
    return `${start} - Present`
  }
  
  const end = formatDate(endDate)
  
  // If same month and year, show only once
  if (start === end) {
    return start
  }
  
  return `${start} - ${end}`
}
