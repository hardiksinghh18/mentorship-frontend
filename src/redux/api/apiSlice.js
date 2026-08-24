import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:5000',
    credentials: 'include',
  }),
  tagTypes: ['User', 'Matches', 'Profile', 'Requests', 'Courses', 'Enrollments'],
  endpoints: (builder) => ({
    // Explore Feed
    getUsers: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            urlParams.append(key, val);
          }
        });
        return `/users?${urlParams.toString()}`;
      },
      providesTags: ['User'],
    }),

    // AI Smart Matches
    getMatches: builder.query({
      query: (id) => `/users/${id}/matches`,
      providesTags: ['Matches'],
    }),

    // User Profile
    getProfile: builder.query({
      query: (username) => `/users/${username}`,
      providesTags: (result, error, arg) => [{ type: 'Profile', id: arg }],
    }),

    // Connection Requests
    getRequests: builder.query({
      query: (username) => `/api/connections/requests/${username}`,
      providesTags: ['Requests'],
    }),

    // Send Connection Request
    sendRequest: builder.mutation({
      query: ({ receiverId, senderId }) => ({
        url: '/api/connections/send',
        method: 'POST',
        body: { receiverId, senderId },
      }),
      invalidatesTags: ['Requests', 'User', 'Matches', 'Profile'],
    }),

    // Respond to Request
    respondToRequest: builder.mutation({
      query: ({ receiverId, senderId, status }) => ({
        url: '/api/connections/requests/handleRequest',
        method: 'PUT',
        body: { receiverId, senderId, status },
      }),
      invalidatesTags: ['Requests', 'User', 'Matches', 'Profile'],
    }),

    // Get User By ID
    getUserById: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }],
    }),

    // Get Chat Messages
    getChatMessages: builder.query({
      query: ({ senderId, receiverId }) => `/api/chat/${senderId}/${receiverId}`,
      providesTags: (result, error, arg) => [
        { type: 'Chat', id: `${arg.senderId}-${arg.receiverId}` }
      ],
    }),

    // Send Chat Message
    sendChatMessage: builder.mutation({
      query: (messageData) => ({
        url: '/api/chat/send',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Chat', id: `${arg.senderId}-${arg.receiverId}` },
        { type: 'Chat', id: `${arg.receiverId}-${arg.senderId}` }
      ],
    }),

    // Courses & Syllabus
    getCourses: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              urlParams.append(key, String(val));
            }
          });
        }
        const queryString = urlParams.toString();
        return `/api/courses${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Courses'],
    }),

    getCourseDetails: builder.query({
      query: (id) => `/api/courses/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Courses', id: arg }],
    }),

    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/api/courses',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: ['Courses'],
    }),

    requestEnrollment: builder.mutation({
      query: (id) => ({
        url: `/api/courses/${id}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Courses', id: arg }],
    }),

    getEnrollmentRequests: builder.query({
      query: (id) => `/api/courses/${id}/requests`,
      providesTags: (result, error, arg) => [{ type: 'Enrollments', id: arg }],
    }),

    manageEnrollmentRequest: builder.mutation({
      query: ({ enrollmentId, status }) => ({
        url: `/api/courses/enrollments/${enrollmentId}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Courses', 'Enrollments'],
    }),

    toggleModuleCompletion: builder.mutation({
      query: ({ courseId, orderIndex }) => ({
        url: `/api/courses/${courseId}/toggle-module`,
        method: 'PUT',
        body: { orderIndex },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Courses', id: arg.courseId }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMatchesQuery,
  useGetProfileQuery,
  useGetRequestsQuery,
  useSendRequestMutation,
  useRespondToRequestMutation,
  useGetUserByIdQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useGetCoursesQuery,
  useGetCourseDetailsQuery,
  useCreateCourseMutation,
  useRequestEnrollmentMutation,
  useGetEnrollmentRequestsQuery,
  useManageEnrollmentRequestMutation,
  useToggleModuleCompletionMutation,
} = apiSlice;
export default apiSlice;
