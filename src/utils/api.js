import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bridge-backend-theta.vercel.app/',
});

export const fetchTokens = (id) => API.get(`/tokens?chainId=${id}`);
export const fetchQuote = (data) => API.post('/quotes', data);
export const createTransaction = (data) => API.post('/params', data);
