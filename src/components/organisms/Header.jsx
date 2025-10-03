import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={24} className="text-gray-700" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{formatDate(currentTime)}</h2>
              <p className="text-sm text-gray-600">{formatTime(currentTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <ApperIcon name="Search" size={18} />
              <span className="hidden md:inline">Search</span>
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" size={18} />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">JS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;