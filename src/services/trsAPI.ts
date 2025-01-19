import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { Ref } from 'vue'
import type { Session, SessionsResponse } from 'src/services/trsApiTypes'

export class TRSAPI {
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

  private async delete(endpoint: string): Promise<void> {
    await axios.delete(`${this.url}${endpoint}`)
  }

  async getStatus(
    serverStatus: Ref<'checking' | 'online' | 'offline'>,
    serverErrorMessage: Ref<string>
  ) {
    serverStatus.value = 'checking'
    try {
      const response = await this.get<{ status: string }>('/status')
      if (response.status === 'ok') {
        serverStatus.value = 'online'
        serverErrorMessage.value = ''
      } else {
        serverStatus.value = 'offline'
        serverErrorMessage.value = 'Неожиданный ответ от сервера.'
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка запроса:', error.message)
      } else {
        console.error('Неизвестная ошибка:', error)
      }
      serverStatus.value = 'offline'
      serverErrorMessage.value = 'Сервер выключен. Пожалуйста, включите его.'
    }
  }

  async getSessions(page = 1, limit = 5): Promise<SessionsResponse> {
    return this.get(`/v1/sessions/read?page=${page}&limit=${limit}`)
  }

  async getSessionDetails(sessionName: string): Promise<Session> {
    return this.get<Session>(`/v1/session/read?name=${sessionName}`)
  }

  async deleteSession(sessionName: string) {
    return this.delete(`/v1/session/delete?name=${sessionName}`)
  }

  async createSession(sessionData: {
    name: string;
    app_version: string;
    lang_code: string;
    device_model: string;
    system_version: string;
    system_lang_code: string;
    api_id: number;
    api_hash: string;
  }) {
    // Отправляем параметры в URL
    const { name, app_version, lang_code, device_model, system_version, system_lang_code, api_id, api_hash } = sessionData;
    const requestBody = {
      app_version,
      lang_code,
      device_model,
      system_version,
      system_lang_code,
      api_id,
      api_hash
    };

    // Передаем name в URL и остальные данные в теле запроса
    return this.post(`/v1/session/create?name=${name}`, requestBody)
  }
}
