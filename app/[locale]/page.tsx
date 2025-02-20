"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoList from "../components/TodoList";
import LanguageSwitch from "../components/LanguageSwitch";
import { useTranslations } from "next-intl";

const queryClient = new QueryClient();

export default function Home() {
    const t = useTranslations();

    return (
        <QueryClientProvider client={queryClient}>
            <main className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-12">
                <div className="container max-w-3xl">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {t("todo.title")}
                        </h1>
                        <LanguageSwitch />
                    </div>
                    <div className="space-y-8">
                        <TodoList />
                    </div>
                </div>
            </main>
        </QueryClientProvider>
    );
}
