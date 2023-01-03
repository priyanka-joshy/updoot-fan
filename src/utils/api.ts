class Api {
  origin: string;
  prefix?: string;

  constructor(origin: string, prefix?: string) {
    this.origin = origin;
    this.prefix = prefix;
  }

  async get(endpoint: string) {
    const url = `${this.origin}${this.prefix ?? ''}${endpoint}`;
    const response = await fetch(url);
    return await response.json();
  }

  async post(endpoint: string, data?: any) {
    const url = `${this.origin}${this.prefix ?? ''}${endpoint}`;
    const body = data ? JSON.stringify(data) : undefined;
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers,
    });
    return await response.json();
  }
}

class Router {
  auth: Api;
  campaign: Api;
  comment: Api;
  proposal: Api;
  user: Api;
  like: Api;

  constructor(origin: string) {
    this.auth = new Api(origin, '/auth');
    this.campaign = new Api(origin, '/campaign');
    this.comment = new Api(origin, '/comment');
    this.proposal = new Api(origin, '/proposal');
    this.user = new Api(origin, '/user');
    this.like = new Api(origin, '/like');
  }
}

// export const BACKEND_URL = 'http://localhost:8000';
export const BACKEND_URL = 'https://updoot-backend-test-rev.herokuapp.com';
export default new Router(`${BACKEND_URL}/api`);
