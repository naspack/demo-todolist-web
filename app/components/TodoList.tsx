import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todos as todosApi } from "../lib/api";
import Todo from "./Todo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateTodoInput, Todo as TodoType } from "../lib/types";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

const newTodoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
});

export default function TodoList() {
    const queryClient = useQueryClient();
    const t = useTranslations();

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

    const completedTodos = todos.filter((todo) => todo.completed);
    const uncompletedTodos = todos.filter((todo) => !todo.completed);

    const createMutation = useMutation({
        mutationFn: todosApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            reset();
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                {t("todo.loading")}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <form
                onSubmit={handleSubmit((data) => createMutation.mutate(data))}
                className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6 transition-all duration-200 hover:shadow-md"
            >
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="title"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                        >
                            <span>{t("todo.newTodo.title")}</span>
                            <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                必填
                            </span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("title")}
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                            placeholder={t("todo.newTodo.titlePlaceholder")}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            data-form-type="other"
                        />
                        {errors.title && (
                            <p className="text-sm font-medium text-destructive mt-2 flex items-center">
                                <span className="i-lucide-alert-circle mr-1 h-4 w-4" />
                                {t("todo.newTodo.titleRequired")}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                        >
                            <span>{t("todo.newTodo.description")}</span>
                            <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                可选
                            </span>
                        </label>
                        <textarea
                            id="description"
                            {...register("description")}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1.5 resize-none"
                            placeholder={t(
                                "todo.newTodo.descriptionPlaceholder"
                            )}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            data-form-type="other"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {createMutation.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t("todo.newTodo.creating")}
                        </>
                    ) : (
                        <>
                            <span className="i-lucide-plus mr-2 h-4 w-4" />
                            {t("todo.newTodo.addTodo")}
                        </>
                    )}
                </Button>
            </form>

            <Tabs.Root defaultValue="uncompleted" className="space-y-6">
                <Tabs.List className="flex space-x-1 border-b">
                    <Tabs.Trigger
                        value="uncompleted"
                        className="flex-1 px-4 py-2.5 -mb-px text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-colors"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <span className="i-lucide-list-todo h-4 w-4" />
                            <span>{t("todo.tabs.uncompleted")}</span>
                            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                                {uncompletedTodos.length}
                            </span>
                        </div>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="completed"
                        className="flex-1 px-4 py-2.5 -mb-px text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-colors"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <span className="i-lucide-check-circle h-4 w-4" />
                            <span>{t("todo.tabs.completed")}</span>
                            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                                {completedTodos.length}
                            </span>
                        </div>
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="uncompleted" className="space-y-4">
                    <AnimatePresence>
                        {uncompletedTodos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Todo todo={todo} />
                            </motion.div>
                        ))}
                        {uncompletedTodos.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-muted/30 rounded-lg"
                            >
                                <div className="i-lucide-list-todo h-12 w-12 mx-auto text-muted-foreground/50" />
                                <p className="text-lg font-medium mt-4">
                                    {t("todo.emptyState.title")}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t("todo.emptyState.description")}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Tabs.Content>

                <Tabs.Content value="completed" className="space-y-4">
                    <AnimatePresence>
                        {completedTodos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Todo todo={todo} />
                            </motion.div>
                        ))}
                        {completedTodos.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-muted/30 rounded-lg"
                            >
                                <div className="i-lucide-check-circle h-12 w-12 mx-auto text-muted-foreground/50" />
                                <p className="text-lg font-medium mt-4">
                                    {t("todo.noCompleted.title")}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t("todo.noCompleted.description")}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
