import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import AssignmentItem from "@/components/organisms/AssignmentItem";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Assignments = () => {
  const location = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.courseId) {
      setFilterCourse(location.state.courseId.toString());
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (assignmentData) => {
    try {
      await assignmentService.create(assignmentData);
      await loadData();
      setIsModalOpen(false);
      toast.success("Assignment created successfully!");
    } catch (err) {
      toast.error("Failed to create assignment");
    }
  };

  const handleUpdate = async (assignmentData) => {
    try {
      await assignmentService.update(editingAssignment.Id, assignmentData);
      await loadData();
      setIsModalOpen(false);
      setEditingAssignment(null);
      toast.success("Assignment updated successfully!");
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(id);
        await loadData();
        toast.success("Assignment deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await assignmentService.toggleComplete(id);
      await loadData();
      toast.success("Assignment status updated!");
    } catch (err) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const getFilteredAndSortedAssignments = () => {
    let filtered = [...assignments];

    if (filterCourse !== "all") {
      filtered = filtered.filter(a => a.courseId === parseInt(filterCourse));
    }

    if (filterStatus === "completed") {
      filtered = filtered.filter(a => a.completed);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter(a => !a.completed);
    }

    filtered.sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "course") {
        return a.courseId - b.courseId;
      }
      return 0;
    });

    return filtered;
  };

  const filteredAssignments = getFilteredAndSortedAssignments();

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const courseOptions = [
    { value: "all", label: "All Courses" },
    ...courses.map(c => ({ value: c.Id.toString(), label: c.name }))
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ];

  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "course", label: "Course" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-gray-600">Track and manage your coursework</p>
        </div>
        <Button onClick={handleOpenModal} icon="Plus" variant="accent">
          Add Assignment
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              options={courseOptions}
            />
          </div>
          <div className="flex-1">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={statusOptions}
            />
          </div>
          <div className="flex-1">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      {filteredAssignments.length > 0 ? (
        <div className="space-y-3">
          {filteredAssignments.map((assignment) => {
            const course = courses.find(c => c.Id === assignment.courseId);
            return (
              <AssignmentItem
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      ) : (
        <Empty
          title="No assignments found"
          description={filterCourse !== "all" || filterStatus !== "all" 
            ? "Try adjusting your filters" 
            : "Start by adding your first assignment!"}
          icon="ClipboardList"
          action={filterCourse === "all" && filterStatus === "all" ? {
            label: "Add Assignment",
            icon: "Plus",
            onClick: handleOpenModal
          } : undefined}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAssignment ? "Edit Assignment" : "Add New Assignment"}
        size="md"
      >
        <AssignmentForm
          assignment={editingAssignment}
          courses={courses}
          onSubmit={editingAssignment ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Assignments;