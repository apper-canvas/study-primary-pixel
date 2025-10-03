import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Grades = () => {
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
      setError("Failed to load grades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseGrade = (courseId) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId && a.grade !== null);
    if (courseAssignments.length === 0) return null;

    const totalWeight = courseAssignments.reduce((sum, a) => sum + a.weight, 0);
    const weightedSum = courseAssignments.reduce((sum, a) => sum + (a.grade * a.weight), 0);
    
    return Math.round(weightedSum / totalWeight);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "info";
    if (grade >= 70) return "warning";
    return "error";
  };

  const getLetterGrade = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  const calculateOverallGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach(course => {
      const grade = calculateCourseGrade(course.Id);
      if (grade !== null) {
        totalCredits += course.credits;
        const gradePoint = grade >= 90 ? 4.0 : grade >= 80 ? 3.0 : grade >= 70 ? 2.0 : grade >= 60 ? 1.0 : 0.0;
        totalPoints += gradePoint * course.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const overallGPA = calculateOverallGPA();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grades</h1>
        <p className="text-gray-600">Track your academic performance</p>
      </div>

      {overallGPA && (
        <Card>
          <div className="p-8 text-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full shadow-2xl mb-4">
              <span className="text-5xl font-bold text-white">{overallGPA}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall GPA</h2>
            <p className="text-gray-600">Based on graded assignments</p>
          </div>
        </Card>
      )}

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {courses.map(course => {
            const courseGrade = calculateCourseGrade(course.Id);
            const courseAssignments = assignments.filter(a => a.courseId === course.Id);
            const gradedAssignments = courseAssignments.filter(a => a.grade !== null);

            return (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <div 
                    className="h-2"
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <ApperIcon name="User" size={16} />
                          {course.instructor}
                        </div>
                        <Badge variant="primary">{course.credits} Credits</Badge>
                      </div>
                      {courseGrade !== null && (
                        <div className="text-right">
                          <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            {courseGrade}%
                          </div>
                          <Badge variant={getGradeColor(courseGrade)} className="text-lg px-4 py-1">
                            {getLetterGrade(courseGrade)}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {gradedAssignments.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-3">Graded Assignments</h4>
                        {gradedAssignments.map(assignment => (
                          <div 
                            key={assignment.Id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">{assignment.title}</h5>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Weight: {assignment.weight}%</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {assignment.grade}%
                              </div>
                              <Badge variant={getGradeColor(assignment.grade)}>
                                {getLetterGrade(assignment.grade)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <ApperIcon name="TrendingUp" size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No graded assignments yet</p>
                        <p className="text-sm text-gray-500 mt-1">Grades will appear here once assignments are graded</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No courses found"
          description="Add courses to start tracking your grades"
          icon="TrendingUp"
        />
      )}
    </div>
  );
};

export default Grades;