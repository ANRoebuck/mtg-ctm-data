const prodBaseUrl = 'https://compare-the-magic.duckdns.org';
const localBaseUrl = 'http://localhost:3000';

export const BASE_URL = import.meta.env.DEV ? localBaseUrl : prodBaseUrl;

export const USE_MOCK_DATA_KEY = 'mtg-ctm-use-mock-data'
