export interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export interface LinkResponse {
  link: Link
}

export interface CreateLinkBody {
  originalUrl: string
  shortUrl: string
}

export interface GetLinksQuery {
  pageIndex?: number
  limit?: number
}

export interface GetLinksResponse {
  links: Link[]
  meta: {
    pageIndex: number
    limit: number
    totalCount: number
  }
}

export interface GetLinkBySlugParams {
  shortUrl: string
}

export interface DeleteLinkParams {
  id: string
}

export interface IncrementAccessParams {
  id: string
}
