import { User, Interview, Comment } from './schema';

// API base URL
const API_BASE = '/api';

// Generic fetch function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Users API
export const usersApi = {
  sync: (userData: { name: string; email: string; image?: string }): Promise<User> =>
    apiRequest('/users/sync', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getAll: (): Promise<User[]> =>
    apiRequest('/users'),

  getByClerkId: (clerkId: string): Promise<User | null> =>
    apiRequest(`/users/${clerkId}`),
};

// Interviews API
export const interviewsApi = {
  getAll: (): Promise<Interview[]> =>
    apiRequest('/interviews'),

  getMy: (): Promise<Interview[]> =>
    apiRequest('/interviews?type=my'),

  getByStreamCallId: (streamCallId: string): Promise<Interview | null> =>
    apiRequest(`/interviews/stream/${streamCallId}`),

  create: (interviewData: {
    title: string;
    description?: string;
    startTime: number;
    status: string;
    streamCallId: string;
    candidateId: string;
    interviewerIds: string[];
  }): Promise<Interview> =>
    apiRequest('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    }),

  updateStatus: (id: string, status: string): Promise<Interview> =>
    apiRequest(`/interviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Comments API
export const commentsApi = {
  getByInterviewId: (interviewId: string): Promise<Comment[]> =>
    apiRequest(`/comments?interviewId=${interviewId}`),

  add: (commentData: {
    interviewId: string;
    content: string;
    rating: number;
  }): Promise<Comment> =>
    apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),
};