import { useState, useCallback } from 'react'
import * as api from './api'
import { useData } from './useData'
import { SellersPanel } from './components/SellersPanel'
import { SearchHistoryPanel } from './components/SearchHistoryPanel'
import { ClickThroughPanel } from './components/ClickThroughPanel'
import { CardsBySellerPanel } from './components/CardsBySellerPanel'
import { FaqPanel } from './components/FaqPanel'
import type { Seller, SearchHistoryEntry, ClickThroughEntry, ClickThroughBySeller, FaqItem, HealthCheckResult } from './types'

export default function App() {
  const [searchDays, setSearchDays] = useState<number | undefined>(undefined)
  const [searchTopN, setSearchTopN] = useState(10)
  const [ctSellerDays, setCtSellerDays] = useState<number | undefined>(undefined)
  const [ctSellerTopN, setCtSellerTopN] = useState(10)
  const [ctCardDays, setCtCardDays] = useState<number | undefined>(undefined)
  const [ctCardTopN, setCtCardTopN] = useState(10)
  const [healthTick, setHealthTick] = useState(0)

  const sellersResult = useData<Seller[]>(
    useCallback(() => api.fetchSellers(), [])
  )

  const searchResult = useData<SearchHistoryEntry[]>(
    useCallback(() => api.fetchSearchHistory(searchDays), [searchDays])
  )

  const ctSellerResult = useData<ClickThroughEntry[]>(
    useCallback(() => api.fetchClickThroughBySeller(ctSellerDays), [ctSellerDays])
  )

  const ctCardResult = useData<ClickThroughEntry[]>(
    useCallback(() => api.fetchClickThroughByCard(ctCardDays), [ctCardDays])
  )

  const ctCardBySellerResult = useData<ClickThroughBySeller[]>(
    useCallback(() => api.fetchClickThroughByCardBySeller(ctCardDays), [ctCardDays])
  )

  const faqResult = useData<FaqItem[]>(
    useCallback(() => api.fetchFaq(), [])
  )

  const healthResult = useData<HealthCheckResult>(
    useCallback(() => api.fetchHealthCheck(), [healthTick])
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
          {anyError && (
            <span className="header-warning">⚠ Connection error</span>
          )}
        </div>
      </header>

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
