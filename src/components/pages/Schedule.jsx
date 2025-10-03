import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";

const Schedule = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00", "21:00"
  ];

  const getClassesForDayAndTime = (day, time) => {
    return courses.filter(course => {
      return course.schedule.some(s => {
        if (s.day !== day) return false;
        const [startHour] = s.startTime.split(":").map(Number);
        const [timeHour] = time.split(":").map(Number);
        const [endHour] = s.endTime.split(":").map(Number);
        return timeHour >= startHour && timeHour < endHour;
      });
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  if (courses.length === 0) {
    return (
      <Empty
        title="No schedule available"
        description="Add courses with schedules to see your weekly timetable"
        icon="Calendar"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Schedule</h1>
        <p className="text-gray-600">Your class schedule for the week</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-200">
              <div className="p-4 font-bold text-gray-700 border-r border-gray-200">Time</div>
              {days.map(day => (
                <div key={day} className="p-4 font-bold text-gray-900 text-center border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            <div className="divide-y divide-gray-200">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-6">
                  <div className="p-4 text-sm text-gray-600 border-r border-gray-200 bg-gray-50">
                    {time}
                  </div>
                  {days.map(day => {
                    const classes = getClassesForDayAndTime(day, time);
                    return (
                      <div 
                        key={`${day}-${time}`} 
                        className="p-2 border-r border-gray-200 last:border-r-0 min-h-[80px]"
                      >
                        {classes.map(course => {
                          const scheduleItem = course.schedule.find(s => s.day === day);
                          return (
                            <motion.div
                              key={course.Id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="h-full p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                              style={{ backgroundColor: `${course.color}20`, borderLeft: `4px solid ${course.color}` }}
                            >
                              <div className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                                {course.name}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                <ApperIcon name="Clock" size={12} />
                                <span>{scheduleItem.startTime} - {scheduleItem.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <ApperIcon name="MapPin" size={12} />
                                <span className="truncate">{scheduleItem.location}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
          <h2 className="text-xl font-bold text-gray-900">Legend</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.Id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: course.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{course.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{course.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;