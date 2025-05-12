"use client"

import React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, className = "", children }: TabsProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className = "", children }: TabsListProps) {
  return (
    <div className={`flex ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, className = "", children }: TabsTriggerProps) {
  return (
    <button 
      className={`px-4 py-2 ${className}`}
      data-state={value === window.location.hash.slice(1) ? "active" : "inactive"}
      onClick={() => window.location.hash = value}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className = "", children }: TabsContentProps) {
  const isActive = value === window.location.hash.slice(1);
  
  if (!isActive) return null;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}
