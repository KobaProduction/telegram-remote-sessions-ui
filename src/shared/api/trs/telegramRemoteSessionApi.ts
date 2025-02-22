import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type {
  Session,
  SessionListResponse,
  SessionParameters,
  ApiResponse, ServerStatus
} from './model'

export class TelegramRemoteSessionApi {
  private axios: AxiosInstance

  constructor(url: string = 'http://localhost') {
    this.axios = axios.create({ baseURL: url })
  }

  protected async get<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return await this.axios.get(endpoint)
  }

  protected async post<T>(endpoint: string, data?: object): Promise<AxiosResponse<T>> {
    return await this.axios.post(endpoint, data)
  }

  protected async put<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return await this.axios.put(endpoint)
  }

  protected async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return await this.axios.delete(endpoint)
  }

  async getStatus(): Promise<ServerStatus> {
    return (await this.get('status')).data as ServerStatus
  }

  async getSessionDetails(sessionName: string): Promise<Session> {
    return (await this.get<Session>(`/v1/session/read?name=${sessionName}`)).data as Session
  }

  async deleteSession(sessionName: string): Promise<ApiResponse> {
    return (await this.delete(`/v1/session/delete?name=${sessionName}`)).data as ApiResponse;
  }

  async createSession(name: string, sessionData: SessionParameters): Promise<ApiResponse> {
    return (await this.post(`/v1/session/create?name=${name}`, sessionData)).data as ApiResponse
  }

  async updateSession(name: string, isActive: boolean | null = null, proxy: string | null = null): Promise<Session | undefined> {
    let url = `/v1/session/update?name=${encodeURIComponent(name)}`
    if (isActive !== null) url += `&active=${encodeURIComponent(isActive)}`
    if (proxy !== null) url += `&proxy=${encodeURIComponent(proxy)}`
    return (await this.put<Session>(url)).data as Session
  }

  async getSessions(state?: number | null, active?: boolean | null): Promise<SessionListResponse> {
    const params = new URLSearchParams();
    if (state != null) {
      params.append("state", String(state));
    }
    if (active != null) {
      params.append("active", String(active));
    }
    const queryString = params.toString();
    const url = `/v1/sessions/read${queryString ? `?${queryString}` : ""}`;
    return (await this.get(url)).data as SessionListResponse;
  }


}
