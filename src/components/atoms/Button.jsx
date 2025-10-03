import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:scale-105 active:scale-100",
    secondary: "bg-gradient-to-r from-secondary to-indigo-700 text-white hover:shadow-lg hover:scale-105 active:scale-100",
    accent: "bg-gradient-to-r from-accent to-orange-600 text-white hover:shadow-lg hover:scale-105 active:scale-100",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-105 active:scale-100"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && iconPosition === "left" && <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
      {children}
      {icon && iconPosition === "right" && <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
    </button>
  );
});

Button.displayName = "Button";

export default Button;