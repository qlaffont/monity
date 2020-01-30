/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const authHeaders = token => ({
  headers: {
    Authorization: token,
  },
});
