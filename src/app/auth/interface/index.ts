export interface IPayload {
  userId: string;
  role: string;
}

export interface IAuthResponse {
  accessToken: string;
  data: {
    user_id: string;
    role: string;
  };
}
