import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, gradient, trend, trendValue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hoverable className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <ApperIcon name={icon} className="text-white" size={24} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${trend === "up" ? "text-success" : "text-error"}`}>
              <ApperIcon name={trend === "up" ? "TrendingUp" : "TrendingDown"} size={16} />
              {trendValue}
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </Card>
    </motion.div>
  );
};

export default StatCard;