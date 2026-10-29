const prodBaseUrl = 'https://compare-the-magic.duckdns.org';
const localBaseUrl = 'http://localhost:3000';

export const BASE_URL = import.meta.env.MODE === 'production' ? prodBaseUrl : localBaseUrl;
