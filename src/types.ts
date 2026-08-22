export interface Seller {
  name: string
  region: string
  logoUrl: string
}

export interface SearchHistoryEntry {
  term: string
  count: number
  lastSearchedAt: string
}

export interface ClickThroughEntry {
  name: string
  count: number
}

export interface ClickThroughBySeller {
  seller: string
  cards: ClickThroughEntry[]
}

export interface FaqItem {
  title: string
  body: string
}

export interface SellerHealthStatus {
  status: 'ok' | 'no results'
  resultCount: number
  searchTerm: string
}

export type HealthCheckResult = Record<string, SellerHealthStatus>
