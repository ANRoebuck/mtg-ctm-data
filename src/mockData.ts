import type { Seller, SearchHistoryEntry, ClickThroughEntry, ClickThroughBySeller, FaqItem, HealthCheckResult } from './types'

export const mockSellers: Seller[] = [
  { name: 'Card Market', region: 'Europe', logoUrl: '' },
  { name: 'MTG Mint Card', region: 'Rest of World', logoUrl: '' },
  { name: 'Mana Stack', region: 'UK', logoUrl: '' },
  { name: 'Star City Games', region: 'North America', logoUrl: '' },
  { name: 'TCGplayer', region: 'North America', logoUrl: '' },
]

export const mockSearchHistory: SearchHistoryEntry[] = [
  { term: 'Lightning Bolt', count: 42, lastSearchedAt: '2026-07-06T14:30:00.000Z' },
  { term: 'Counterspell', count: 38, lastSearchedAt: '2026-07-07T09:00:00.000Z' },
  { term: 'Steam Vents', count: 31, lastSearchedAt: '2026-07-05T18:22:00.000Z' },
  { term: 'Snapcaster Mage', count: 29, lastSearchedAt: '2026-07-06T11:10:00.000Z' },
  { term: 'Brainstorm', count: 25, lastSearchedAt: '2026-07-07T08:45:00.000Z' },
  { term: 'Force of Will', count: 22, lastSearchedAt: '2026-07-04T20:00:00.000Z' },
  { term: 'Tarmogoyf', count: 18, lastSearchedAt: '2026-07-03T16:30:00.000Z' },
  { term: 'Dark Confidant', count: 15, lastSearchedAt: '2026-07-02T12:00:00.000Z' },
  { term: 'Path to Exile', count: 14, lastSearchedAt: '2026-07-01T10:00:00.000Z' },
  { term: 'Thoughtseize', count: 12, lastSearchedAt: '2026-06-30T09:00:00.000Z' },
]

export const mockClickThroughBySeller: ClickThroughEntry[] = [
  { name: 'Card Market', count: 87 },
  { name: 'TCGplayer', count: 64 },
  { name: 'Mana Stack', count: 43 },
  { name: 'Star City Games', count: 38 },
  { name: 'MTG Mint Card', count: 21 },
]

export const mockClickThroughByCard: ClickThroughEntry[] = [
  { name: 'Lightning Bolt', count: 56 },
  { name: 'Snapcaster Mage', count: 49 },
  { name: 'Counterspell', count: 41 },
  { name: 'Steam Vents', count: 35 },
  { name: 'Force of Will', count: 28 },
  { name: 'Brainstorm', count: 22 },
  { name: 'Tarmogoyf', count: 19 },
  { name: 'Dark Confidant', count: 14 },
]

export const mockClickThroughByCardBySeller: ClickThroughBySeller[] = [
  {
    seller: 'Card Market',
    cards: [
      { name: 'Lightning Bolt', count: 24 },
      { name: 'Counterspell', count: 19 },
      { name: 'Steam Vents', count: 15 },
      { name: 'Brainstorm', count: 9 },
    ],
  },
  {
    seller: 'TCGplayer',
    cards: [
      { name: 'Snapcaster Mage', count: 21 },
      { name: 'Lightning Bolt', count: 17 },
      { name: 'Force of Will', count: 13 },
      { name: 'Tarmogoyf', count: 6 },
    ],
  },
  {
    seller: 'Mana Stack',
    cards: [
      { name: 'Counterspell', count: 14 },
      { name: 'Steam Vents', count: 12 },
      { name: 'Dark Confidant', count: 9 },
    ],
  },
  {
    seller: 'Star City Games',
    cards: [
      { name: 'Brainstorm', count: 11 },
      { name: 'Tarmogoyf', count: 10 },
      { name: 'Path to Exile', count: 8 },
    ],
  },
  {
    seller: 'MTG Mint Card',
    cards: [
      { name: 'Force of Will', count: 7 },
      { name: 'Thoughtseize', count: 6 },
    ],
  },
]

export const mockFaq: FaqItem[] = [
  {
    title: 'How are prices sourced?',
    body: 'Prices are fetched in real-time by querying each seller\'s website. Results are cached briefly to avoid excessive requests. Prices reflect live listings at the time of search.',
  },
  {
    title: 'Why might some sellers be unavailable?',
    body: 'A seller may be temporarily unavailable if their website has changed in a way that affects our data extraction, or if they are blocking automated requests. We regularly update our integrations.',
  },
  {
    title: 'Are prices in my local currency?',
    body: 'Prices are shown in the currency used by each seller\'s website. UK sellers show GBP, European sellers show EUR, and North American sellers show USD.',
  },
  {
    title: 'Sponsorship disclosure',
    body: 'This tool is not sponsored by or affiliated with any card seller. It is an independent price comparison tool for the MTG community.',
  },
]

export const mockHealthCheck: HealthCheckResult = {
  'Card Market': { status: 'ok', resultCount: 12, searchTerm: 'Lightning Bolt' },
  'MTG Mint Card': { status: 'ok', resultCount: 8, searchTerm: 'Steam Vents' },
  'Mana Stack': { status: 'ok', resultCount: 5, searchTerm: 'Counterspell' },
  'Star City Games': { status: 'no results', resultCount: 0, searchTerm: 'Counterspell' },
  'TCGplayer': { status: 'ok', resultCount: 20, searchTerm: 'Lightning Bolt' },
}
