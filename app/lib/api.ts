import axios from "axios";
import { CreateTodoInput, Todo, UpdateTodoInput } from "./types";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

export const todos = {
    create: async (data: CreateTodoInput) => {
        const response = await api.post<Todo>("/api/todos", data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get<Todo[]>("/api/todos");
        return response.data;
    },
    getOne: async (id: number) => {
        const response = await api.get<Todo>(`/api/todos/${id}`);
        return response.data;
    },
    update: async (id: number, data: UpdateTodoInput) => {
        const response = await api.put<Todo>(`/api/todos/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/api/todos/${id}`);
    },
    batchDelete: async (ids: number[]) => {
        await Promise.all(ids.map((id) => api.delete(`/api/todos/${id}`)));
    },
    batchUpdate: async (ids: number[], data: Partial<UpdateTodoInput>) => {
        await Promise.all(
            ids.map((id) =>
                api.put(`/api/todos/${id}`, {
                    ...data,
                    title: undefined,
                    description: undefined,
                })
            )
        );
    },
};
