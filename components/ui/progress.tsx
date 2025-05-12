"use client"

import React from "react"

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className = "" }: ProgressProps) {
  return (
    <div className={`h-2 w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-purple-600 rounded-full" 
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
