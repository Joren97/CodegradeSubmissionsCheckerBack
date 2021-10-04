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

const getCourses = async (req: Request, res: Response, next: NextFunction) => {
    let loginResult: AxiosResponse = await axios.post(`${baseUrl}/login`, login);
    const accessToken = loginResult.data.access_token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    let coursesResult: AxiosResponse = await axios.get(`${baseUrl}/courses`);
    const x = coursesResult.data.map((x: any) => {
        return {id: x.id, name: x.name}
    });    
    return res.status(200).json(
        x
    );
}

export default { getCourses };