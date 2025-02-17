export interface SessionParameters {
  api_id: number
  api_hash: string
  app_version: string
  lang_code: string
  device_model: string
  system_version: string
  system_lang_code: string
}

export interface ServerStatus {
  status: string
  version: string
  name: string
}

export interface Session {
  is_active: boolean
  is_authenticated: boolean
  is_broken: boolean
  proxy: string | null
  session_parameters: SessionParameters
}


export interface SessionListResponse {
  sessions: string[]
}

export interface ApiResponse {
  status: boolean
  message: string
}
