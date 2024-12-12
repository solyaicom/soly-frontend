export interface IAuthLimit {
  access_token: string;
  id: string;
  next_href?: string;
  status?: number;
}

export interface IUserProfile {
  name: string;
  id: string;
  current_session: {
    data: {
      session_key: string;
    };
  } | null;
  username: string;
}
