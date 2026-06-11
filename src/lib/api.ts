// Cliente de API ELECTRA — aponta para o dashboard
const API_URL = 'https://electra-dashboard-steel.vercel.app/api';

export const electraApi = {
  async register(name: string, email: string, password: string, phone?: string) {
    const r = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    return r.json();
  },

  async login(email: string, password: string) {
    const r = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },

  async getMe(token: string) {
    const r = await fetch(API_URL + '/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    return r.json();
  },

  async getEstacoes() {
    const r = await fetch(API_URL + '/estacoes');
    return r.json();
  },

  async createSOS(token: string, data: { latitude: number, longitude: number, address?: string, description?: string }) {
    const r = await fetch(API_URL + '/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(data),
    });
    return r.json();
  },
};

export default electraApi;
