import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

const AssignmentItem = ({ assignment, course, onToggleComplete, onEdit, onDelete }) => {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = isPast(dueDate) && !assignment.completed;
  const isDueToday = isToday(dueDate);
  const isDueTomorrow = isTomorrow(dueDate);

  const getPriorityVariant = () => {
    if (assignment.priority === "high") return "error";
    if (assignment.priority === "medium") return "warning";
    return "info";
  };

  const getDueDateText = () => {
    if (isOverdue) return "Overdue";
    if (isDueToday) return "Due Today";
    if (isDueTomorrow) return "Due Tomorrow";
    return formatDistanceToNow(dueDate, { addSuffix: true });
  };

  const getDueDateVariant = () => {
    if (isOverdue) return "error";
    if (isDueToday) return "warning";
    return "default";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-xl shadow-sm border-2 p-4 transition-all duration-200 hover:shadow-md ${
        isOverdue ? "border-error" : isDueToday ? "border-warning" : "border-gray-100"
      } ${assignment.completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleComplete(assignment.Id)}
          className="mt-1 flex-shrink-0"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            assignment.completed 
              ? "bg-success border-success" 
              : "border-gray-300 hover:border-primary"
          }`}>
            {assignment.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <ApperIcon name="Check" size={14} className="text-white" />
              </motion.div>
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-1 ${assignment.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {assignment.title}
              </h3>
              {assignment.description && (
                <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <div 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${course.color}20`,
                    color: course.color
                  }}
                >
                  {course.name}
                </div>
                <Badge variant={getPriorityVariant()}>
                  {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                </Badge>
                {assignment.grade !== null && (
                  <Badge variant="success">
                    Grade: {assignment.grade}%
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(assignment)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="Edit" size={18} className="text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(assignment.Id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Trash2" size={18} className="text-error" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <ApperIcon name="Calendar" size={16} className="text-gray-500" />
              <span className="text-gray-600">{format(dueDate, "MMM dd, yyyy 'at' h:mm a")}</span>
            </div>
            <Badge variant={getDueDateVariant()}>
              {getDueDateText()}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentItem;