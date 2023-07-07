import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token'); // getState().auth.token;
    // console.log("prepared header", token);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if ([403, 401].includes(result?.error?.originalStatus || result?.error?.status)) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;

      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data, user }));

      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    }
    // else {
    //   api.dispatch(logOut());
    // }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
