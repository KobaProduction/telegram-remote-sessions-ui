import type { TelegramRemoteSessionApi } from '@/shared/api/trs'

export interface NewServerData {
  name: string
  url: string
}

export interface ServerHistoryItem {
  name: string
  url: string
}

export interface ServersHistory {
  [id: string]: ServerHistoryItem
}


export interface ServerHistoryObject extends ServerHistoryItem {
  api: TelegramRemoteSessionApi
  connected: boolean
}

export interface ServersHistoryObjects {
  [id: string]: ServerHistoryObject
}

