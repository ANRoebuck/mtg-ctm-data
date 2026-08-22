import { useState, useCallback } from 'react'
import { USE_MOCK_DATA_KEY } from './config'
import * as api from './api'
import * as mock from './mockData'
import { useData } from './useData'
import { SellersPanel } from './components/SellersPanel'
import { SearchHistoryPanel } from './components/SearchHistoryPanel'
import { ClickThroughPanel } from './components/ClickThroughPanel'
import { CardsBySellerPanel } from './components/CardsBySellerPanel'
import { FaqPanel } from './components/FaqPanel'
import type { Seller, SearchHistoryEntry, ClickThroughEntry, ClickThroughBySeller, FaqItem, HealthCheckResult } from './types'

function initMock(): boolean {
  return localStorage.getItem(USE_MOCK_DATA_KEY) === 'true'
}

export default function App() {
  const [useMock, setUseMock] = useState(initMock)
  const [searchDays, setSearchDays] = useState<number | undefined>(undefined)
  const [searchTopN, setSearchTopN] = useState(10)
  const [ctSellerDays, setCtSellerDays] = useState<number | undefined>(undefined)
  const [ctSellerTopN, setCtSellerTopN] = useState(5)
  const [ctCardDays, setCtCardDays] = useState<number | undefined>(undefined)
  const [ctCardTopN, setCtCardTopN] = useState(10)
  const [healthTick, setHealthTick] = useState(0)

  const toggleMock = () => {
    setUseMock(prev => {
      const next = !prev
      localStorage.setItem(USE_MOCK_DATA_KEY, String(next))
      return next
    })
  }

  const sellersResult = useData<Seller[]>(
    useCallback(() => useMock ? Promise.resolve(mock.mockSellers) : api.fetchSellers(), [useMock])
  )

  const searchResult = useData<SearchHistoryEntry[]>(
    useCallback(() => useMock ? Promise.resolve(mock.mockSearchHistory) : api.fetchSearchHistory(searchDays), [useMock, searchDays])
  )

  const ctSellerResult = useData<ClickThroughEntry[]>(
    useCallback(() => useMock ? Promise.resolve(mock.mockClickThroughBySeller) : api.fetchClickThroughBySeller(ctSellerDays), [useMock, ctSellerDays])
  )

  const ctCardResult = useData<ClickThroughEntry[]>(
    useCallback(() => useMock ? Promise.resolve(mock.mockClickThroughByCard) : api.fetchClickThroughByCard(ctCardDays), [useMock, ctCardDays])
  )

  const ctCardBySellerResult = useData<ClickThroughBySeller[]>(
    useCallback(() => useMock ? Promise.resolve(mock.mockClickThroughByCardBySeller) : api.fetchClickThroughByCardBySeller(ctCardDays), [useMock, ctCardDays])
  )

  const faqResult = useData<FaqItem[]>(
    useCallback(() => useMock ? Promise.resolve(mock.mockFaq) : api.fetchFaq(), [useMock])
  )

  const healthResult = useData<HealthCheckResult>(
    useCallback(() => useMock ? Promise.resolve(mock.mockHealthCheck) : api.fetchHealthCheck(), [useMock, healthTick])
  )

  const anyError = [sellersResult, searchResult, ctSellerResult, ctCardResult, ctCardBySellerResult].some(r => r.status === 'error')

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">MTG CTM</h1>
          <span className="app-subtitle">Card price analytics</span>
        </div>
        <div className="header-right">
          {anyError && !useMock && (
            <span className="header-warning">⚠ Connection error</span>
          )}
          <label className="mock-toggle">
            <input type="checkbox" checked={useMock} onChange={toggleMock} />
            <span className="mock-toggle-label">Mock data</span>
          </label>
        </div>
      </header>

      {useMock && (
        <div className="mock-banner">
          Using mock data — toggle off to connect to the live backend.
        </div>
      )}

      <main className="app-grid">
        <div className="grid-col">
          <SellersPanel
            sellers={sellersResult.data}
            loading={sellersResult.status === 'loading'}
            error={sellersResult.error}
            health={healthResult.data}
            healthLoading={healthResult.status === 'loading'}
            healthError={healthResult.error}
            onRecheck={() => setHealthTick(t => t + 1)}
          />
          <FaqPanel
            faq={faqResult.data}
            loading={faqResult.status === 'loading'}
            error={faqResult.error}
          />
        </div>

        <div className="grid-col wide">
          <SearchHistoryPanel
            history={searchResult.data}
            loading={searchResult.status === 'loading'}
            error={searchResult.error}
            days={searchDays}
            onDaysChange={setSearchDays}
            topN={searchTopN}
            onTopNChange={setSearchTopN}
          />
          <ClickThroughPanel
            title="Click-throughs by Seller"
            data={ctSellerResult.data}
            loading={ctSellerResult.status === 'loading'}
            error={ctSellerResult.error}
            days={ctSellerDays}
            onDaysChange={setCtSellerDays}
            topN={ctSellerTopN}
            onTopNChange={setCtSellerTopN}
          />
          <CardsBySellerPanel
            allSellers={ctCardResult.data}
            allSellersLoading={ctCardResult.status === 'loading'}
            allSellersError={ctCardResult.error}
            bySeller={ctCardBySellerResult.data}
            bySellerLoading={ctCardBySellerResult.status === 'loading'}
            bySellerError={ctCardBySellerResult.error}
            days={ctCardDays}
            onDaysChange={setCtCardDays}
            topN={ctCardTopN}
            onTopNChange={setCtCardTopN}
          />
        </div>
      </main>
    </div>
  )
}
