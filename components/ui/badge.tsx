import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

export function Badge({ 
  children, 
  variant = "default", 
  className = "",
  onClick
}: BadgeProps) {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background text-foreground"
  };
  
  const classes = `${baseStyle} ${variantStyles[variant]} ${className}${onClick ? " cursor-pointer" : ""}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
