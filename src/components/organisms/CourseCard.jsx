import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const CourseCard = ({ course, onEdit, onDelete, onViewAssignments }) => {
  const getNextClass = () => {
    if (!course.schedule || course.schedule.length === 0) return null;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date().getDay();
    const todayName = days[today];
    
    const todayClass = course.schedule.find(s => s.day === todayName);
    if (todayClass) {
      return { day: "Today", time: todayClass.startTime };
    }
    
    return { day: course.schedule[0].day, time: course.schedule[0].startTime };
  };

  const nextClass = getNextClass();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hoverable className="overflow-hidden">
        <div 
          className="h-3"
          style={{ backgroundColor: course.color }}
        />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <ApperIcon name="User" size={16} />
                {course.instructor}
              </div>
              <Badge variant="primary">{course.credits} Credits</Badge>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(course)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="Edit" size={18} className="text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(course.Id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Trash2" size={18} className="text-error" />
              </button>
            </div>
          </div>

          {nextClass && (
            <div className="mb-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <ApperIcon name="Clock" size={16} className="text-primary" />
                <span className="font-medium text-gray-900">Next Class:</span>
                <span className="text-gray-600">{nextClass.day} at {nextClass.time}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onViewAssignments(course)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ApperIcon name="ClipboardList" size={16} />
              Assignments
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;