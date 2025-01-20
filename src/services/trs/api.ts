import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
  ServerStatusResponse,
  Session,
  SessionListResponse,
  SessionParameters,
  FullSessionData, ApiResponse
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

  async getStatus(): Promise<boolean> {
    const response: ServerStatusResponse = await this.get('/status')
    return response.status === 'ok'
  }

  async updateSession(name: string, isActive: boolean | null = null, proxy: string | null = null): Promise<Session | undefined> {
    try {
      let url = `/v1/session/update?name=${encodeURIComponent(name)}`
      if (isActive !== null) url += `&active=${encodeURIComponent(isActive)}`
      if (proxy !== null) url += `&proxy=${encodeURIComponent(proxy)}`
      return await this.put<Session>(url)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка при обновлении сессии:', error)
        throw new Error(error?.message || 'Ошибка при обновлении сессии')
      } else {
        console.error('Unknown error')
      }
    }
  }

  async getSessions(): Promise<SessionListResponse> {
    return this.get(`/v1/sessions/read`)
  }

  async getSessionDetails(sessionName: string): Promise<Session> {
    return this.get<Session>(`/v1/session/read?name=${sessionName}`)
  }

  async deleteSession(sessionName: string): Promise<ApiResponse> {
      return this.delete(`/v1/session/delete?name=${sessionName}`);
  }

  async createSession(name: string, sessionData: SessionParameters): Promise<FullSessionData> {
    return this.post(`/v1/session/create?name=${name}`, sessionData)
  }
}
