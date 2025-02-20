import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todos } from "../lib/api";
import { Todo as TodoType } from "../lib/types";
import { Loader2, Pencil, Trash2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "./ui/utils";
import { useLocale } from "next-intl";
import { formatDate } from "../lib/utils";
import useSound from "use-sound";
import { showRandomConfetti } from "../lib/confetti";

const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
});

interface TodoProps {
    todo: TodoType;
}

export default function Todo({ todo }: TodoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formattedDate, setFormattedDate] = useState<string>("");
    const queryClient = useQueryClient();
    const t = useTranslations();
    const locale = useLocale();

    // 添加完成音效
    const [playComplete] = useSound("/sounds/complete.mp3", { volume: 0.2 });

    useEffect(() => {
        setFormattedDate(formatDate(todo.created_at, locale));
    }, [todo.created_at, locale]);

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
        onError: (error) => {
            console.error("Error updating todo:", error);
            // You could add a toast notification here
        },
    });

    const toggleCompleteMutation = useMutation({
        mutationFn: () =>
            todo.completed
                ? todos.uncomplete(todo.id)
                : todos.complete(todo.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            // 当任务完成时播放音效和烟花
            if (!todo.completed) {
                playComplete();
                showRandomConfetti();
            }
        },
        onError: (error) => {
            console.error("Error toggling todo completion:", error);
            // You could add a toast notification here
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => todos.delete(todo.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
        onError: (error) => {
            console.error("Error deleting todo:", error);
            // You could add a toast notification here
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
                        disabled={updateMutation.isPending}
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
                        disabled={updateMutation.isPending}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={updateMutation.isPending}
                    >
                        {t("todo.actions.cancel")}
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {t("todo.actions.saving")}
                            </>
                        ) : (
                            t("todo.actions.save")
                        )}
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow group">
            <div className="p-6 flex items-center space-x-4">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleCompleteMutation.mutate()}
                    className="h-5 w-5"
                    disabled={toggleCompleteMutation.isPending}
                />
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
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formattedDate ? (
                            t("todo.metadata.createdAt", {
                                datetime: formattedDate,
                            })
                        ) : (
                            <span className="animate-pulse bg-muted rounded w-24 h-3" />
                        )}
                    </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        title={t("todo.actions.edit")}
                        disabled={
                            toggleCompleteMutation.isPending ||
                            deleteMutation.isPending
                        }
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate()}
                        title={t("todo.actions.delete")}
                        disabled={
                            toggleCompleteMutation.isPending ||
                            deleteMutation.isPending
                        }
                    >
                        {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
