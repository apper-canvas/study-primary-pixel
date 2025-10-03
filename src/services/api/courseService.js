import { toast } from "react-toastify";

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const courseService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}}
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords("course_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch courses:", response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(course => ({
        Id: course.Id,
        name: course.title_c || "",
        instructor: course.instructor_c || "",
        credits: course.credits_c || 3,
        semester: course.Name || "",
        color: "#4A90E2",
        schedule: []
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById("course_c", parseInt(id), params);
      
      if (!response.data) {
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.title_c || "",
        instructor: response.data.instructor_c || "",
        credits: response.data.credits_c || 3,
        semester: response.data.Name || "",
        color: "#4A90E2",
        schedule: []
      };
    } catch (error) {
      console.error("Error fetching course:", error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (courseData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: courseData.semester || "Fall 2024",
          title_c: courseData.name,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits)
        }]
      };
      
      const response = await apperClient.createRecord("course_c", params);
      
      if (!response.success) {
        console.error("Failed to create course:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          return {
            Id: successful[0].data.Id,
            name: courseData.name,
            instructor: courseData.instructor,
            credits: parseInt(courseData.credits),
            semester: courseData.semester || "Fall 2024",
            color: courseData.color || "#4A90E2",
            schedule: courseData.schedule || []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, courseData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          Name: courseData.semester || "Fall 2024",
          title_c: courseData.name,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits)
        }]
      };
      
      const response = await apperClient.updateRecord("course_c", params);
      
      if (!response.success) {
        console.error("Failed to update course:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          return {
            Id: parseInt(id),
            name: courseData.name,
            instructor: courseData.instructor,
            credits: parseInt(courseData.credits),
            semester: courseData.semester || "Fall 2024",
            color: courseData.color || "#4A90E2",
            schedule: courseData.schedule || []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("course_c", params);
      
      if (!response.success) {
        console.error("Failed to delete course:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      return false;
    }
  }
};