export interface NewServerData {
  name: string
  url: string
}

export type ServerCrudApiErrorCallback = (error: Error) => void
