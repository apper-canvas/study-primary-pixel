import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title = "No items found", description = "Get started by adding your first item", icon = "Inbox", action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="text-gray-400" size={48} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-accent to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name={action.icon} size={18} />
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default Empty;