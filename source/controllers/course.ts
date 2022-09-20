import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Assignment } from '../types/assignment';
import { getLoggedInClient } from './helpers';
import courses from '../enums/courses';

const getCourses = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(
        courses
    );
}

const getCourseWithAssignments = async (req: Request, res: Response, next: NextFunction) => {
    const courseId: string = <string>req.params.courseId;
    let client = axios;
    client = await getLoggedInClient(client);
    let { data }: AxiosResponse = await client.get(`${process.env.CODEGRADE_BASE_URL}/courses/${courseId}/assignments`);

    const hiddenAssignments = process.env.HIDDEN_ASSIGNMENTS;

    const assignmentsToShow = data.map((assignment: Assignment) => {
        if (!hiddenAssignments!.includes(assignment.id.toString())) {
            return assignment;
        }
    });

    const result = assignmentsToShow.sort((a: { name: string }, b: { name: string }) => (a.name > b.name ? 1 : -1));

    return res.status(200).json(
        result
    );
}

export default { getCourseWithAssignments, getCourses };