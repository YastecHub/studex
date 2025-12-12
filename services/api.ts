const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://studex-backend-api.onrender.com' 
  : 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export const signup = async (formData: FormData): Promise<ApiResponse> => {
  console.log('API_BASE_URL:', API_BASE_URL);
  
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    body: formData
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Response error:', errorText);
    return { success: false, message: `Server error: ${response.status}` };
  }
  
  const result = await response.json();
  console.log('Signup response:', result);
  return result;
};

export const login = async (email: string, password: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const getProfile = async (): Promise<ApiResponse> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const getServices = async (filters: any = {}): Promise<ApiResponse> => {
  const token = getToken();
  const params = new URLSearchParams({
    page: filters.page || '1',
    limit: filters.limit || '12',
    ...(filters.category && filters.category !== 'All' && { category: filters.category }),
    ...(filters.search && { search: filters.search })
  });

  const response = await fetch(`${API_BASE_URL}/api/services?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const createService = async (serviceData: any): Promise<ApiResponse> => {
  const token = getToken();
  const formData = new FormData();
  
  formData.append('title', serviceData.title);
  formData.append('description', serviceData.description);
  formData.append('category', serviceData.category);
  formData.append('price', serviceData.price.toString());
  formData.append('priceType', serviceData.priceType || 'FIXED');
  formData.append('skills', JSON.stringify(serviceData.skills));
  
  if (serviceData.portfolioImages) {
    serviceData.portfolioImages.forEach((image: File) => {
      formData.append('portfolioImages', image);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/services`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};

export const postJob = async (jobData: any): Promise<ApiResponse> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: jobData.title,
      description: jobData.description,
      category: jobData.category,
      budget: parseInt(jobData.budget),
      deadline: jobData.deadline,
      skills: Array.isArray(jobData.skills) ? jobData.skills : jobData.skills.split(',').map((s: string) => s.trim())
    })
  });
  return response.json();
};

export const getJobs = async (filters: any = {}): Promise<ApiResponse> => {
  const token = getToken();
  const params = new URLSearchParams({
    page: filters.page || '1',
    limit: filters.limit || '10',
    ...(filters.category && filters.category !== 'All' && { category: filters.category })
  });

  const response = await fetch(`${API_BASE_URL}/api/jobs?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};