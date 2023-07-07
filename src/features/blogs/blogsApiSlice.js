import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (blog) => ({
        url: '/blog',
        method: "POST",
        body: {
          ...blog,
          date: new Date().toISOString(),
        },
      }),
      // keepUnusedDataFor: 5, // default 60s
    }),
    getUsers: builder.query({
      query: ({ limit = 9, skip = 0, search = '', sort = '', order }) => ({
        url: `/blog?limit=${limit}&skip=${skip}&search=${search}&sort=${sort}&order=${order}`,
      }),
      // keepUnusedDataFor: 5, // default 60s
    }),
    getBlog: builder.query({
      query: (id) => `/blog/${id}`,
      // keepUnusedDataFor: 5, // default 60s
    }),
    updateBlog: builder.mutation({
      query: (blog) => ({
        url: `/blog/${blog._id}`,
        method: "PUT",
        body: {
          ...blog,
          date: new Date().toISOString(),
        },
      }),
      // keepUnusedDataFor: 5, // default 60s
    }),
    deleteBlog: builder.mutation({
      query: ({ _id }) => ({
        url: `/blog/${_id}`,
        method: "PUT",
        body: {
          isDelete: true,
        },
      }),
      // keepUnusedDataFor: 5, // default 60s
    }),
  }),
});

export const {
  useAddBlogMutation,
  useGetUsersQuery,
  useGetBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useLazyGetUsersQuery
} = usersApiSlice;
