/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { generateAxiosConfig, HTTPMethod } from './generateAxiosConfig';

export const getGroups = () => generateAxiosConfig('/groups', HTTPMethod.GET);
export const getGroupById = (id: string) => generateAxiosConfig('/groups/' + id, HTTPMethod.GET);
export const postGroup = () => generateAxiosConfig('/groups', HTTPMethod.POST);
export const putGroup = (id: string) => generateAxiosConfig('/groups/' + id, HTTPMethod.PUT);
export const deleteGroup = (id: string) => generateAxiosConfig('/groups/' + id, HTTPMethod.DELETE);
