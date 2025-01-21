import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
  ServerStatusResponse,
  Session,
  SessionListResponse,
  SessionParameters,
  ApiResponse
} from './models'

export class TrsApi {
  private readonly url: string

  constructor(url: string) {
    this.url = url
  }

  private async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await axios.get(`${this.url}${endpoint}`)
    return response.data
  }

  private async post<T>(endpoint: string, data?: object): Promise<T> {
    const response: AxiosResponse<T> = await axios.post(`${this.url}${endpoint}`, data)
    return response.data
  }

  private async put<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await axios.put(`${this.url}${endpoint}`)
    return response.data
  }

  private async delete<T>(endpoint: string): Promise<T> {
    return await axios.delete(`${this.url}${endpoint}`)
  }

  async getStatus(): Promise<string> {
    const response: ServerStatusResponse = await this.get('status')
    return response.status
  }

  async updateSession(name: string, isActive: boolean | null = null, proxy: string | null = null): Promise<Session | undefined> {
    let url = `v1/session/update?name=${encodeURIComponent(name)}`
    if (isActive !== null) url += `&active=${encodeURIComponent(isActive)}`
    if (proxy !== null) url += `&proxy=${encodeURIComponent(proxy)}`
    return await this.put<Session>(url)
  }

  async getSessions(): Promise<SessionListResponse> {
    return this.get(`v1/sessions/read`)
  }

  async getSessionDetails(sessionName: string): Promise<Session> {
    return this.get<Session>(`v1/session/read?name=${sessionName}`)
  }

  async deleteSession(sessionName: string): Promise<ApiResponse> {
      return this.delete(`v1/session/delete?name=${sessionName}`);
  }

  async createSession(name: string, sessionData: SessionParameters): Promise<ApiResponse> {
    return this.post(`v1/session/create?name=${name}`, sessionData)
  }
}
