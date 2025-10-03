import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import CourseCard from "@/components/organisms/CourseCard";
import CourseForm from "@/components/organisms/CourseForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

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
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (courseData) => {
    try {
      await courseService.create(courseData);
      await loadCourses();
      setIsModalOpen(false);
      toast.success("Course created successfully!");
    } catch (err) {
      toast.error("Failed to create course");
    }
  };

  const handleUpdate = async (courseData) => {
    try {
      await courseService.update(editingCourse.Id, courseData);
      await loadCourses();
      setIsModalOpen(false);
      setEditingCourse(null);
      toast.success("Course updated successfully!");
    } catch (err) {
      toast.error("Failed to update course");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.delete(id);
        await loadCourses();
        toast.success("Course deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete course");
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleViewAssignments = (course) => {
    navigate("/assignments", { state: { courseId: course.Id } });
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-gray-600">Manage your courses for {courses[0]?.semester || "Fall 2024"}</p>
        </div>
        <Button onClick={handleOpenModal} icon="Plus" variant="accent">
          Add Course
        </Button>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewAssignments={handleViewAssignments}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No courses yet"
          description="Start by adding your first course to get organized!"
          icon="BookOpen"
          action={{
            label: "Add Course",
            icon: "Plus",
            onClick: handleOpenModal
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        size="lg"
      >
        <CourseForm
          course={editingCourse}
          onSubmit={editingCourse ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Courses;