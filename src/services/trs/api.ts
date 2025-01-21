import axios from 'axios'
import type {AxiosResponse } from 'axios'
import type {
  Session,
  SessionListResponse,
  SessionParameters,
  ApiResponse, ServerStatus
} from './models'

export class TrsApi {
  private readonly url: URL

  constructor(url: string = "http://localhost") {
    this.url = new URL(url)
  }

  private async get<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return await axios.get(`${this.url}${endpoint}`)
  }

  private async post<T>(endpoint: string, data?: object): Promise<AxiosResponse<T>> {
    return await axios.post(`${this.url}${endpoint}`, data)
  }

  private async put<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return await axios.put(`${this.url}${endpoint}`)
  }

  private async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return await axios.delete(`${this.url}${endpoint}`)
  }

  async getStatus(): Promise<ServerStatus> {
    return (await this.get('v1/status')).data as ServerStatus
  }

  async updateSession(name: string, isActive: boolean | null = null, proxy: string | null = null): Promise<Session | undefined> {
    let url = `v1/session/update?name=${encodeURIComponent(name)}`
    if (isActive !== null) url += `&active=${encodeURIComponent(isActive)}`
    if (proxy !== null) url += `&proxy=${encodeURIComponent(proxy)}`
    return (await this.put<Session>(url)).data as Session
  }

  async getSessions(): Promise<SessionListResponse> {
    return (await this.get(`v1/sessions/read`)).data as SessionListResponse
  }

  async getSessionDetails(sessionName: string): Promise<Session> {
    return (await this.get<Session>(`v1/session/read?name=${sessionName}`)).data as Session
  }

  async deleteSession(sessionName: string): Promise<ApiResponse> {
      return (await this.delete(`v1/session/delete?name=${sessionName}`)).data as ApiResponse;
  }

  async createSession(name: string, sessionData: SessionParameters): Promise<ApiResponse> {
    return (await this.post(`v1/session/create?name=${name}`, sessionData)).data as ApiResponse
  }
}
