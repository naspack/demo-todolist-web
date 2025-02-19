import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const TodoService = {
  // 获取所有Todo
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/api/todos');
    return response.data;
  },

  // 获取单个Todo
  getTodoById: async (id: number): Promise<Todo> => {
    const response = await api.get(`/api/todos/${id}`);
    return response.data;
  },

  // 创建Todo
  createTodo: async (input: CreateTodoInput): Promise<Todo> => {
    const response = await api.post('/api/todos', input);
    return response.data;
  },

  // 更新Todo
  updateTodo: async (id: number, input: UpdateTodoInput): Promise<Todo> => {
    const response = await api.put(`/api/todos/${id}`, input);
    return response.data;
  },

  // 删除Todo
  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/api/todos/${id}`);
  },
};