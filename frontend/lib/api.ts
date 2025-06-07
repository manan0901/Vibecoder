// API utility functions for making requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Get authentication token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

// Make authenticated API request
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error');
  }
}

// Authentication API calls
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  refreshToken: (refreshToken: string) =>
    apiRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  getProfile: () => apiRequest('/auth/profile'),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// User API calls
export const userApi = {
  getProfile: (userId: string) => apiRequest(`/users/${userId}`),

  updateProfile: (profileData: {
    firstName: string;
    lastName: string;
    bio?: string;
    phone?: string;
  }) =>
    apiRequest('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  getStats: () => apiRequest('/users/me/stats'),

  getProjects: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    return apiRequest(`/users/me/projects${query ? `?${query}` : ''}`);
  },

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiRequest('/users/me/avatar', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  },

  deleteAvatar: () =>
    apiRequest('/users/me/avatar', {
      method: 'DELETE',
    }),
};

// Settings API calls
export const settingsApi = {
  getSettings: () => apiRequest('/settings'),

  updateSettings: (settings: {
    emailNotifications?: boolean;
    marketingEmails?: boolean;
    profileVisibility?: 'PUBLIC' | 'PRIVATE';
    showEmail?: boolean;
    showPhone?: boolean;
    language?: string;
    timezone?: string;
    currency?: string;
  }) =>
    apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  getNotificationSettings: () => apiRequest('/settings/notifications'),

  updateNotificationSettings: (notifications: {
    email?: Record<string, boolean>;
    push?: Record<string, boolean>;
    sms?: Record<string, boolean>;
  }) =>
    apiRequest('/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(notifications),
    }),

  getPrivacySettings: () => apiRequest('/settings/privacy'),

  updatePrivacySettings: (privacy: {
    profileVisibility?: 'PUBLIC' | 'PRIVATE';
    showEmail?: boolean;
    showPhone?: boolean;
    showLastSeen?: boolean;
    showProjects?: boolean;
    showReviews?: boolean;
    allowDirectMessages?: boolean;
    showOnlineStatus?: boolean;
  }) =>
    apiRequest('/settings/privacy', {
      method: 'PUT',
      body: JSON.stringify(privacy),
    }),
};

// Projects API calls (placeholder for future implementation)
export const projectsApi = {
  getProjects: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    
    const query = searchParams.toString();
    return apiRequest(`/projects${query ? `?${query}` : ''}`);
  },

  getProject: (projectId: string) => apiRequest(`/projects/${projectId}`),

  createProject: (projectData: any) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),

  updateProject: (projectId: string, projectData: any) =>
    apiRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }),

  deleteProject: (projectId: string) =>
    apiRequest(`/projects/${projectId}`, {
      method: 'DELETE',
    }),
};

// Export the main API request function for custom calls
export { apiRequest, ApiError };
