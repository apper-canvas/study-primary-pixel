import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { format, isToday, isPast } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTodaySchedule = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    
    const todayClasses = courses.filter(course => 
      course.schedule.some(s => s.day === todayName)
    ).map(course => ({
      ...course,
      todaySchedule: course.schedule.filter(s => s.day === todayName)
    }));

    return todayClasses;
  };

  const getUpcomingAssignments = () => {
    return assignments
      .filter(a => !a.completed && !isPast(new Date(a.dueDate)))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getStats = () => {
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.completed).length;
    const overdueAssignments = assignments.filter(a => !a.completed && isPast(new Date(a.dueDate))).length;
    const upcomingAssignments = assignments.filter(a => !a.completed && !isPast(new Date(a.dueDate))).length;

    return {
      totalCourses: courses.length,
      totalAssignments,
      completedAssignments,
      overdueAssignments,
      upcomingAssignments,
      completionRate: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0
    };
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const todaySchedule = getTodaySchedule();
  const upcomingAssignments = getUpcomingAssignments();
  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
        </div>
        <Button onClick={() => navigate("/assignments")} icon="Plus" variant="accent">
          New Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon="BookOpen"
          gradient="from-primary to-blue-600"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingAssignments}
          icon="Clock"
          gradient="from-accent to-orange-600"
        />
        <StatCard
          title="Completed"
          value={stats.completedAssignments}
          icon="CheckCircle"
          gradient="from-success to-green-600"
          trend="up"
          trendValue={`${stats.completionRate}%`}
        />
        <StatCard
          title="Overdue"
          value={stats.overdueAssignments}
          icon="AlertCircle"
          gradient="from-error to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <Button onClick={() => navigate("/schedule")} variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              {todaySchedule.length > 0 ? (
                <div className="space-y-4">
                  {todaySchedule.map(course => (
                    <div key={course.Id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                        style={{ backgroundColor: course.color }}
                      >
                        <ApperIcon name="BookOpen" className="text-white" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate mb-1">{course.name}</h3>
                        {course.todaySchedule.map((schedule, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <ApperIcon name="Clock" size={14} />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                            <span>•</span>
                            <span>{schedule.location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  title="No classes today"
                  description="Enjoy your free day!"
                  icon="Calendar"
                />
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-accent/5 to-orange-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
                <Button onClick={() => navigate("/assignments")} variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              {upcomingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAssignments.map(assignment => {
                    const course = courses.find(c => c.Id === assignment.courseId);
                    const dueDate = new Date(assignment.dueDate);
                    const isDueToday = isToday(dueDate);

                    return (
                      <div 
                        key={assignment.Id} 
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate("/assignments")}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate mb-1">{assignment.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            {course && (
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${course.color}20`,
                                  color: course.color
                                }}
                              >
                                {course.name}
                              </span>
                            )}
                            {isDueToday ? (
                              <Badge variant="warning">Due Today</Badge>
                            ) : (
                              <span className="text-gray-600">
                                {format(dueDate, "MMM dd 'at' h:mm a")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty
                  title="All caught up!"
                  description="No upcoming assignments at the moment."
                  icon="CheckCircle"
                />
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-success/5 to-green-100">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/courses")}
                className="p-6 bg-gradient-to-br from-primary/5 to-blue-100 rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <ApperIcon name="Plus" className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Add Course</h3>
                <p className="text-sm text-gray-600">Create a new course</p>
              </button>

              <button
                onClick={() => navigate("/assignments")}
                className="p-6 bg-gradient-to-br from-accent/5 to-orange-100 rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <ApperIcon name="ClipboardList" className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Add Assignment</h3>
                <p className="text-sm text-gray-600">Track new work</p>
              </button>

              <button
                onClick={() => navigate("/schedule")}
                className="p-6 bg-gradient-to-br from-secondary/5 to-indigo-100 rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-indigo-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <ApperIcon name="Calendar" className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">View Schedule</h3>
                <p className="text-sm text-gray-600">Check your week</p>
              </button>

              <button
                onClick={() => navigate("/grades")}
                className="p-6 bg-gradient-to-br from-success/5 to-green-100 rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <ApperIcon name="TrendingUp" className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">View Grades</h3>
                <p className="text-sm text-gray-600">Check progress</p>
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;