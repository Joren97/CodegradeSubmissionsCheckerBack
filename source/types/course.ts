import { chapter } from "./chapter";

export interface course {
    codegradeId: number;
    name: string;
    chapters: Array<chapter>
}