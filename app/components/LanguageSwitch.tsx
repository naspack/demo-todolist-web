import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LanguageSwitch() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    return (
        <div className="flex space-x-2">
            <Button
                variant={locale === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => switchLanguage("en")}
            >
                English
            </Button>
            <Button
                variant={locale === "zh" ? "default" : "outline"}
                size="sm"
                onClick={() => switchLanguage("zh")}
            >
                中文
            </Button>
        </div>
    );
}
