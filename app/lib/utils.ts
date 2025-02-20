import { format, parseISO } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

export function formatDate(date: string | Date, locale: string = "zh") {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    // 使用 Asia/Shanghai 时区来确保服务端和客户端使用相同的时区
    return formatInTimeZone(parsedDate, "Asia/Shanghai", "yyyy-MM-dd HH:mm", {
        locale: locale === "zh" ? zhCN : enUS,
    });
}
