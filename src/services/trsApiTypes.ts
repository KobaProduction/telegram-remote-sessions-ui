
export interface Session {
  name: string;


}

export interface ApiResponse {
  status: string;
  message: string;
  name?: string;
  is_active?: boolean;
  is_authenticated?: boolean;
  is_broken?: boolean;
  session_parameters?: {
    app_version: string;
    lang_code: string;
    device_model: string;
    system_version: string;
    system_lang_code: string;
    api_id: number;
    api_hash: string;
  };
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
}
