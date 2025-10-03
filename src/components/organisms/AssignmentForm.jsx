import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";

const AssignmentForm = ({ assignment, courses, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    weight: 10
  });

  useEffect(() => {
    if (assignment) {
      const dueDate = new Date(assignment.dueDate);
      const formattedDate = dueDate.toISOString().slice(0, 16);
      setFormData({
        ...assignment,
        dueDate: formattedDate
      });
    } else if (courses.length > 0) {
      setFormData(prev => ({ ...prev, courseId: courses[0].Id }));
    }
  }, [assignment, courses]);

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  const courseOptions = courses.map(course => ({
    value: course.Id,
    label: course.name
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      courseId: parseInt(formData.courseId)
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Assignment Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="e.g., Programming Assignment 1"
        required
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe the assignment requirements..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Course"
          value={formData.courseId}
          onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
          options={courseOptions}
          required
        />
        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          options={priorityOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date & Time"
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
        <Input
          label="Weight (%)"
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
          min="0"
          max="100"
          required
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;