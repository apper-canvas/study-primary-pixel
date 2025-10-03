import { cn } from "@/utils/cn";

const Card = ({ children, className, hoverable = false }) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100",
      hoverable && "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;