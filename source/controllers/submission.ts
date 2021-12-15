import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Assignment } from '../types/assignment';
require('dotenv').config()
const baseUrl = "https://tm.codegra.de/api/v1";
const login = {
    username: process.env.LOGIN_USERNAME,
    password: process.env.LOGIN_PASSWORD,
    tenantId: process.env.TENANT_ID
}

const getSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let userNumber: string = <string>req.query.studentNumber;
    let courseId: string = <string>req.query.courseId;
    // get the post

    let loginResult: AxiosResponse = await axios.post(`${baseUrl}/login`, login);
    const accessToken = loginResult.data.access_token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    let userResult: AxiosResponse = await axios.get(`${baseUrl}/users?q=${userNumber}`);

    let userId = userResult.data[0].id;

    let courseResult: AxiosResponse = await axios.get(`${baseUrl}/courses/${courseId}`);

    let course = courseResult.data;

    let assignmentIds: Array<any> = course.assignments.map((x: any) => {
        return { id: x.id, name: x.name };
    });

    let resultToReturn: Array<Assignment> = [];
    let requests: any = [];
    let requestResults: Array<any> = [];

    assignmentIds.forEach((x) => {
        requests.push(axios.get(`${baseUrl}/assignments/${x.id}/users/${userId}/submissions/`));
    })

    await Promise.all(requests).then((values) => {
        values.forEach((x: any) => {
            requestResults.push(x.data)
        })
    })

    const result = requestResults.reduce((accumulator: any, value: any) => accumulator.concat(value), []);
   

    assignmentIds.forEach(x => {
        const resultFromUser = result.find((y: any) => y.assignment_id == x.id);

        resultToReturn.push({
            name: x.name,
            submitted: resultFromUser != undefined,
            grade: (resultFromUser != undefined && resultFromUser.grade) ? Math.round(resultFromUser.grade) : 0
        })
    })

    let percentages: Array<{chapter: string, score: number, max: number}> = [];
    const gradedAssignments = ["01","02","03","04","05"]

    for (let i = 1; i <= 10; i++) {
        const chapter = pad(i, 2);
        let max = 0;
        let achieved = 0;
        gradedAssignments.forEach(name => {
            const assignment = resultToReturn.find(x => x.name.includes(`${chapter}.${name}`));

            if (assignment) {
                max += 10;
                achieved += assignment.grade;
            }
        });  
        percentages.push({chapter, score: achieved, max})    
    }

    return res.status(200).json(
        {submissions: resultToReturn, percentages}
    );
};

export default { getSubmissions };

function pad(num: number, size: number) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}