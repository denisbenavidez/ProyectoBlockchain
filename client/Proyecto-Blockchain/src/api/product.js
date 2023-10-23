import axios from "./axios";

export const getTasksRequest = () => axios.get('/tasks');

export const getTaskRequest = (id) => axios.get(`/tasks${id}`);

export const createTasksRequest = (product) => axios.post('/tasks', product);

export const updateTasksRequest = (product) => axios.put(`/tasks/${product._id}`, product);

export const deleteTasksRequest = (id) => axios.delete(`/tasks/${id}`);

