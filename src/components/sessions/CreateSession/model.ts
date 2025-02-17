export interface SessionData {
  name: string
  appVersion: string
  langCode: string
  deviceModel: string
  systemVersion: string
  systemLangCode: string
  apiId: number
  apiHash: string
  sessionName: string
}

export interface Device {
  deviceName: string
  data: Omit<SessionData, 'name'>
}
