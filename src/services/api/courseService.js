import coursesData from "../mockData/courses.json";

let courses = [...coursesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const courseService = {
  getAll: async () => {
    await delay();
    return [...courses];
  },

  getById: async (id) => {
    await delay();
    const course = courses.find(c => c.Id === parseInt(id));
    return course ? { ...course } : null;
  },

  create: async (courseData) => {
    await delay();
    const maxId = courses.reduce((max, c) => Math.max(max, c.Id), 0);
    const newCourse = {
      ...courseData,
      Id: maxId + 1
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  update: async (id, courseData) => {
    await delay();
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      courses[index] = { ...courses[index], ...courseData, Id: parseInt(id) };
      return { ...courses[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      courses.splice(index, 1);
      return true;
    }
    return false;
  }
};