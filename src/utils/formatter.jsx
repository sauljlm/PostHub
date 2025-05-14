import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (date, pattern = "yyyy-MM-dd HH:mm:ss") => {
    if (!date) return "";
    return format(new Date(date), pattern);
};

export const timeAgo = (date) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
};
