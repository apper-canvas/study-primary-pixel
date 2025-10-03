let assignments = [];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const assignmentService = {
  getAll: async () => {
    await delay();
    return [...assignments];
  },

  getById: async (id) => {
    await delay();
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  getByCourseId: async (courseId) => {
    await delay();
    return assignments.filter(a => a.courseId === parseInt(courseId));
  },

  create: async (assignmentData) => {
    await delay();
    const maxId = assignments.reduce((max, a) => Math.max(max, a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      completed: false,
      grade: null
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  update: async (id, assignmentData) => {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...assignmentData, Id: parseInt(id) };
      return { ...assignments[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments.splice(index, 1);
      return true;
    }
    return false;
  },

  toggleComplete: async (id) => {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index].completed = !assignments[index].completed;
      return { ...assignments[index] };
    }
    return null;
  }
};