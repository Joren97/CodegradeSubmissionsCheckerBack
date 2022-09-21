import { Assignment } from "./assignment";

export interface chapter {
    number: string;
    name: string;
    assignments: Array<Assignment>
    mandatoryAssignments: Array<string>
    deadline?: string
}