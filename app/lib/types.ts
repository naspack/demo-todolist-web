export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CreateTodoInput {
    title: string;
    description: string;
}

export interface UpdateTodoInput {
    title: string;
    description: string;
    completed: boolean;
}
