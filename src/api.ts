import { BASE_URL } from './config'
import type { Seller, SearchHistoryEntry, ClickThroughEntry, ClickThroughBySeller, FaqItem, HealthCheckResult } from './types'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((body as { message: string }).message ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export async function fetchSellers(): Promise<Seller[]> {
  const data = await get<{ sellers: Seller[] }>('/api/prices')
  return data.sellers
}

export async function fetchSearchHistory(days?: number): Promise<SearchHistoryEntry[]> {
  const query = days != null ? `?days=${days}` : ''
  const data = await get<{ searchHistory: SearchHistoryEntry[] }>(`/api/data/search-history${query}`)
  return data.searchHistory
}

export async function fetchClickThroughBySeller(days?: number): Promise<ClickThroughEntry[]> {
  const query = days != null ? `?days=${days}` : ''
  const data = await get<{ clickThroughs: ClickThroughEntry[] }>(`/api/data/click-through/sellers${query}`)
  return data.clickThroughs
}

export async function fetchClickThroughByCard(days?: number): Promise<ClickThroughEntry[]> {
  const query = days != null ? `?days=${days}` : ''
  const data = await get<{ clickThroughs: ClickThroughEntry[] }>(`/api/data/click-through/cards${query}`)
  return data.clickThroughs
}

export async function fetchClickThroughByCardBySeller(days?: number): Promise<ClickThroughBySeller[]> {
  const query = days != null ? `?days=${days}` : ''
  const data = await get<{ clickThroughs: ClickThroughBySeller[] }>(`/api/data/click-through/cards-by-seller${query}`)
  return data.clickThroughs
}

export async function fetchFaq(): Promise<FaqItem[]> {
  const data = await get<{ faq: FaqItem[] }>('/api/info/faq')
  return data.faq
}

export async function fetchHealthCheck(): Promise<HealthCheckResult> {
  const data = await get<{ testData: HealthCheckResult }>('/api/prices/test-all-models')
  return data.testData
}
