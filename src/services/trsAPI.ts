import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { Ref } from 'vue'


export class TRSAPI {
  private readonly url: string

  constructor(url: string) {
    this.url = url
  }

  async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await axios.get(`${this.url}${endpoint}`)
    return response.data
  }

  async getStatus(
    serverStatus: Ref<'checking' | 'online' | 'offline'>,
    serverErrorMessage: Ref<string>
  ) {
    serverStatus.value = 'checking'

    try {
      const response = await this.get<{ status: string }>('/status')
      console.log(response.status)

      if (response.status === 'ok') { // Сервер должен вернуть { "status": "ok" }
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
}
