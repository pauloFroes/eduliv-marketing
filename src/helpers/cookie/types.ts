interface Cookie {
  name: string
  value?: string
  options?: {
    maxAge?: number
    path?: string
    httpOnly?: boolean
    secure?: boolean
  }
}

export type { Cookie }
