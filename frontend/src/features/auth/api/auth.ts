import api from '../../../api/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};
