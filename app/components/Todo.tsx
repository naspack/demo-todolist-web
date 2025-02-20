import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todos } from "../lib/api";
import { Todo as TodoType } from "../lib/types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "./ui/utils";

const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
});

interface TodoProps {
    todo: TodoType;
    selected?: boolean;
    onSelect?: () => void;
}

export default function Todo({ todo, selected, onSelect }: TodoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();
    const t = useTranslations();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            title: todo.title,
            description: todo.description,
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: { title: string; description: string }) =>
            todos.update(todo.id, { ...data, completed: todo.completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            setIsEditing(false);
        },
    });

    const toggleCompleteMutation = useMutation({
        mutationFn: () =>
            todos.update(todo.id, {
                title: todo.title,
                description: todo.description,
                completed: !todo.completed,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => todos.delete(todo.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    if (isEditing) {
        return (
            <form
                onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4"
            >
                <div>
                    <input
                        type="text"
                        {...register("title")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                    <textarea
                        {...register("description")}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={t("todo.newTodo.description")}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-form-type="other"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                    >
                        {t("todo.actions.cancel")}
                    </Button>
                    <Button type="submit">{t("todo.actions.save")}</Button>
                </div>
            </form>
        );
    }

    return (
        <div
            className={cn(
                "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow group",
                selected && "border-primary"
            )}
        >
            <div className="p-6 flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                    <Checkbox
                        checked={selected}
                        onCheckedChange={onSelect}
                        className="h-5 w-5"
                    />
                    <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleCompleteMutation.mutate()}
                        className="h-5 w-5"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3
                        className={cn(
                            "text-lg font-medium leading-none tracking-tight",
                            todo.completed &&
                                "line-through text-muted-foreground"
                        )}
                    >
                        {todo.title}
                    </h3>
                    <p
                        className={cn(
                            "text-sm text-muted-foreground mt-2 line-clamp-2",
                            todo.completed && "text-muted-foreground/70"
                        )}
                    >
                        {todo.description}
                    </p>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        title={t("todo.actions.edit")}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate()}
                        title={t("todo.actions.delete")}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
