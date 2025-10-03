import gradesData from "../mockData/grades.json";

let grades = [...gradesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const gradeService = {
  getAll: async () => {
    await delay();
    return [...grades];
  },

  getByCourseId: async (courseId) => {
    await delay();
    return grades.filter(g => g.courseId === parseInt(courseId));
  },

  getByAssignmentId: async (assignmentId) => {
    await delay();
    const grade = grades.find(g => g.assignmentId === parseInt(assignmentId));
    return grade ? { ...grade } : null;
  },

  create: async (gradeData) => {
    await delay();
    const maxId = grades.reduce((max, g) => Math.max(max, g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  update: async (id, gradeData) => {
    await delay();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData, Id: parseInt(id) };
      return { ...grades[index] };
    }
    return null;
  }
};