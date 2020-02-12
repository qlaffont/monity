/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { generateAxiosConfig, HTTPMethod } from './generateAxiosConfig';

export const getCheckers = () => generateAxiosConfig('/checkers', HTTPMethod.GET);
export const getCheckerById = (id: string) => generateAxiosConfig('/checkers/' + id, HTTPMethod.GET);
export const postChecker = () => generateAxiosConfig('/checkers', HTTPMethod.POST);
export const putChecker = (id: string) => generateAxiosConfig('/checkers/' + id, HTTPMethod.PUT);
export const deleteChecker = (id: string) => generateAxiosConfig('/checkers/' + id, HTTPMethod.DELETE);
export const startChecker = (id: string) => generateAxiosConfig('/checkers/' + id + '/start', HTTPMethod.PUT);
export const stopChecker = (id: string) => generateAxiosConfig('/checkers/' + id + '/stop', HTTPMethod.PUT);
