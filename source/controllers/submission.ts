import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Assignment } from '../types/assignment';
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
        resultToReturn.push({
            name: x.name,
            submitted: result.find((y: any) => y.assignment_id == x.id) != undefined
        })
    })

    return res.status(200).json(
        resultToReturn
    );
};

export default { getSubmissions };