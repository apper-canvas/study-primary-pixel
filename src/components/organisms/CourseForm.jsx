import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    color: "#4A90E2",
    credits: 3,
    semester: "Fall 2024",
    schedule: []
  });

  const [scheduleItem, setScheduleItem] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    location: ""
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const colorOptions = [
    { value: "#4A90E2", label: "Blue" },
    { value: "#5C6BC0", label: "Indigo" },
    { value: "#66BB6A", label: "Green" },
    { value: "#FFA726", label: "Orange" },
    { value: "#AB47BC", label: "Purple" },
    { value: "#EF5350", label: "Red" },
    { value: "#26A69A", label: "Teal" },
    { value: "#42A5F5", label: "Light Blue" }
  ];

  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" }
  ];

  const handleAddSchedule = () => {
    if (scheduleItem.location) {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, scheduleItem]
      });
      setScheduleItem({
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
        location: ""
      });
    }
  };

  const handleRemoveSchedule = (index) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Course Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Introduction to Computer Science"
          required
        />
        <Input
          label="Instructor"
          value={formData.instructor}
          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          placeholder="e.g., Dr. Sarah Johnson"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          options={colorOptions}
        />
        <Input
          label="Credits"
          type="number"
          value={formData.credits}
          onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
          min="1"
          max="6"
          required
        />
        <Input
          label="Semester"
          value={formData.semester}
          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
          placeholder="e.g., Fall 2024"
          required
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Class Schedule</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Select
            label="Day"
            value={scheduleItem.day}
            onChange={(e) => setScheduleItem({ ...scheduleItem, day: e.target.value })}
            options={dayOptions}
          />
          <Input
            label="Start Time"
            type="time"
            value={scheduleItem.startTime}
            onChange={(e) => setScheduleItem({ ...scheduleItem, startTime: e.target.value })}
          />
          <Input
            label="End Time"
            type="time"
            value={scheduleItem.endTime}
            onChange={(e) => setScheduleItem({ ...scheduleItem, endTime: e.target.value })}
          />
          <Input
            label="Location"
            value={scheduleItem.location}
            onChange={(e) => setScheduleItem({ ...scheduleItem, location: e.target.value })}
            placeholder="Room 301"
          />
        </div>

        <Button type="button" onClick={handleAddSchedule} variant="outline" size="sm">
          <ApperIcon name="Plus" size={16} />
          Add Schedule
        </Button>

        {formData.schedule.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.schedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  {item.day} • {item.startTime} - {item.endTime} • {item.location}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="p-1 hover:bg-red-50 rounded transition-colors"
                >
                  <ApperIcon name="X" size={16} className="text-error" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {course ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;