import axios from "axios";
import { CreateTodoInput, Todo, UpdateTodoInput } from "./types";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);

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
        const response = await api.post<Todo>("/api/todos/get", { id });
        return response.data;
    },
    update: async (id: number, data: UpdateTodoInput) => {
        const response = await api.post<Todo>("/api/todos/update", {
            id,
            ...data,
        });
        return response.data;
    },
    complete: async (id: number) => {
        try {
            console.log("Completing todo:", id);
            const response = await api.post<Todo>("/api/todos/complete", {
                id,
            });
            console.log("Complete response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error completing todo:", error);
            throw error;
        }
    },
    uncomplete: async (id: number) => {
        try {
            console.log("Uncompleting todo:", id);
            const response = await api.post<Todo>("/api/todos/uncomplete", {
                id,
            });
            console.log("Uncomplete response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error uncompleting todo:", error);
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            console.log("Deleting todo:", id);
            await api.post("/api/todos/delete", { id });
            console.log("Todo deleted successfully");
        } catch (error) {
            console.error("Error deleting todo:", error);
            throw error;
        }
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
