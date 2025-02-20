import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todos as todosApi } from "../lib/api";
import Todo from "./Todo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateTodoInput, Todo as TodoType } from "../lib/types";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { cn } from "./ui/utils";

const newTodoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
});

export default function TodoList() {
    const queryClient = useQueryClient();
    const t = useTranslations();
    const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTodoInput>({
        resolver: zodResolver(newTodoSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const { data: todos = [], isLoading } = useQuery<TodoType[]>({
        queryKey: ["todos"],
        queryFn: todosApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: todosApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            reset();
        },
    });

    const batchDeleteMutation = useMutation({
        mutationFn: todosApi.batchDelete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            setSelectedTodos([]);
        },
    });

    const batchUpdateMutation = useMutation({
        mutationFn: (completed: boolean) =>
            todosApi.batchUpdate(selectedTodos, { completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const toggleTodo = (id: number) => {
        setSelectedTodos((prev) =>
            prev.includes(id)
                ? prev.filter((todoId) => todoId !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedTodos((prev) =>
            prev.length === todos.length ? [] : todos.map((todo) => todo.id)
        );
    };

    const handleBatchComplete = (completed: boolean) => {
        batchUpdateMutation.mutate(completed);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                {t("todo.loading")}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <form
                onSubmit={handleSubmit((data) => createMutation.mutate(data))}
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4"
            >
                <div>
                    <label
                        htmlFor="title"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {t("todo.newTodo.title")}
                    </label>
                    <input
                        type="text"
                        id="title"
                        {...register("title")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                        placeholder={t("todo.newTodo.title")}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-form-type="other"
                    />
                    {errors.title && (
                        <p className="text-sm font-medium text-destructive mt-2">
                            {t("todo.newTodo.titleRequired")}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {t("todo.newTodo.description")}
                    </label>
                    <textarea
                        id="description"
                        {...register("description")}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                        placeholder={t("todo.newTodo.description")}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-form-type="other"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full"
                >
                    {createMutation.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t("todo.newTodo.creating")}
                        </>
                    ) : (
                        t("todo.newTodo.addTodo")
                    )}
                </Button>
            </form>

            {todos.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <Checkbox
                            checked={selectedTodos.length === todos.length}
                            onCheckedChange={toggleAll}
                            className="h-5 w-5"
                        />
                        <span className="text-sm text-muted-foreground">
                            {selectedTodos.length === 0
                                ? "Select items"
                                : `${selectedTodos.length} item${
                                      selectedTodos.length === 1 ? "" : "s"
                                  } selected`}
                        </span>
                    </div>
                    {selectedTodos.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBatchComplete(true)}
                            >
                                Complete Selected
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBatchComplete(false)}
                            >
                                Uncomplete Selected
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                    batchDeleteMutation.mutate(selectedTodos)
                                }
                                title="Delete Selected"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-3">
                {todos?.map((todo) => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        selected={selectedTodos.includes(todo.id)}
                        onSelect={() => toggleTodo(todo.id)}
                    />
                ))}
                {todos?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-lg font-medium">No todos yet</p>
                        <p className="text-sm mt-2">
                            Add your first todo above
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
