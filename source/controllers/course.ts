import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Assignment } from '../types/assignment';
import { getLoggedInClient, getUserIdFromStudentNumber, sleep } from './helpers';
import courses from '../enums/courses';
import dummyData from '../enums/offlineDummyData';

const getCourses = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(
        courses
    );
}

const getCourseWithAssignmentsAndGrade = async (req: Request, res: Response, next: NextFunction) => {
    console.log("getCourseWithAssignmentsAndGrade")
    const courseId: string = <string>req.params.courseId;
    let studentNumber: string = <string>req.query.studentNumber;

    let client = axios;
    client = await getLoggedInClient(client);

    const userId = await getUserIdFromStudentNumber(studentNumber, client);
    let { data }: AxiosResponse = await client.get(`${process.env.CODEGRADE_BASE_URL}/courses/${courseId}/assignments`);

    const hiddenAssignments = process.env.HIDDEN_ASSIGNMENTS;

    // Filter out hidden assignments
    let assignmentsToShow: Array<Assignment> = data.map((assignment: Assignment) => {
        if (!hiddenAssignments!.includes(assignment.id.toString())) {
            return assignment;
        }
    });

    // Sort all assignments based on their name
    assignmentsToShow = assignmentsToShow.sort((a: { name: string }, b: { name: string }) => (a.name > b.name ? 1 : -1));


    // Create a request to get the grade for each assignment
    let requests: any = [];
    assignmentsToShow.forEach((x) => {
        requests.push(axios.get(`${process.env.CODEGRADE_BASE_URL}/assignments/${x.id}/users/${userId}/submissions/`));
    })

    // Wait for all requests to finish    
    await Promise.all(requests).then((values) => {
        values.forEach((x: any) => {
            // If a submission is found
            if (x.data.length > 0) {
                // Get the assignment and set the grade to the grade of the latest submission
                let assignment = assignmentsToShow.find((y: Assignment) => y.id === x.data[0].assignment_id);
                assignment!.grade = x.data[0].grade;
            }
        })
    })

    // Get course where id equals courseId
    let course = courses.find(course => course.codegradeId === parseInt(courseId));

    // Add assignments to chapters
    assignmentsToShow.forEach((a => {
        const assignmentChapterNumber = a.name.substring(0, 2);
        const assignmentNumber = a.name.substring(3, 5);
        const chapter = course?.chapters.find(c => c.number === assignmentChapterNumber);
        console.log("Assignment: " + a.name + " Chapter: " + assignmentChapterNumber + " AssignmentNumber: " + assignmentNumber);
        // Check whether the assignment is mandatory
        a.mandatory = chapter!.mandatoryAssignments.includes(assignmentNumber);
        chapter?.assignments.push(a);
        if (a.mandatory) chapter!.deadline = a.deadline;
    }));

    return res.status(200).json(
        course
    );
}

const getCourseWithAssignmentsAndGradeOffline = async (req: Request, res: Response, next: NextFunction) => {
    console.log("getCourseWithAssignmentsAndGradeOffline")

    await sleep(2500);

    return res.status(200).json(
        dummyData
    );
}

export default { getCourseWithAssignmentsAndGrade, getCourses, getCourseWithAssignmentsAndGradeOffline };