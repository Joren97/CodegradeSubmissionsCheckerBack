import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse, AxiosStatic } from 'axios';
import { Assignment } from '../types/assignment';
require('dotenv').config()
const baseUrl = "https://tm.codegra.de/api/v1";
const login = {
    username: process.env.CODEGRADE_USERNAME,
    password: process.env.CODEGRADE_PASSWORD,
    tenantId: process.env.CODEGRADE_TENANT_ID
}

const getLoggedInClient = async (client: AxiosStatic) => {
    let { data: { access_token } }: AxiosResponse = await axios.post(`${baseUrl}/login`, login);
    client.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    return client;
}

const getUserIdFromStudentNumber = async (studentNumber: string, client: AxiosStatic) => {
    let userResult: AxiosResponse = await client.get(`${process.env.CODEGRADE_BASE_URL}/users?q=${studentNumber}`);
    return userResult.data[0].id;
}

const getLatestResultForAssignment = async (assignmentId: string, userId: string, client: AxiosStatic) => {
    let { data }: AxiosResponse = await client.get(`${process.env.CODEGRADE_BASE_URL}/assignments/${assignmentId}/users/${userId}/submissions/`);
    return data;
}

export { getLoggedInClient, getUserIdFromStudentNumber, getLatestResultForAssignment }