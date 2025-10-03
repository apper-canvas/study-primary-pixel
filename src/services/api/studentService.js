import { toast } from "react-toastify";

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords("students_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      toast.error("Failed to fetch students");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("students_c", id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch student details");
      return null;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const record = {
        Name: studentData.Name || "",
        first_name_c: studentData.first_name_c || "",
        last_name_c: studentData.last_name_c || "",
        email_c: studentData.email_c || "",
        phone_c: studentData.phone_c || "",
        Tags: studentData.Tags || ""
      };

      // Remove empty fields
      Object.keys(record).forEach(key => {
        if (record[key] === "" || record[key] === null || record[key] === undefined) {
          delete record[key];
        }
      });

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord("students_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create student: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel || 'Error'}: ${error.message || error}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("Student created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      toast.error("Failed to create student");
      return null;
    }
  },

  async update(id, studentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const record = {
        Id: parseInt(id),
        Name: studentData.Name,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c,
        Tags: studentData.Tags
      };

      // Remove empty fields except Id
      Object.keys(record).forEach(key => {
        if (key !== 'Id' && (record[key] === "" || record[key] === null || record[key] === undefined)) {
          delete record[key];
        }
      });

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord("students_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update student: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel || 'Error'}: ${error.message || error}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("Student updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      toast.error("Failed to update student");
      return null;
    }
  },

  async delete(studentIds) {
    try {
      const apperClient = getApperClient();
      const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
      
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };

      const response = await apperClient.deleteRecord("students_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} student(s): ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success(`Student${successful.length > 1 ? 's' : ''} deleted successfully`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      toast.error("Failed to delete student");
      return false;
    }
  }
};