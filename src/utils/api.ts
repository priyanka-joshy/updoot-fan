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
    const response = await fetch(url, { method: 'POST', body });
    return await response.json();
  }
}

class Router {
  comment: Api;
  proposal: Api;
  user: Api;

  constructor(origin: string) {
    this.comment = new Api(origin, '/comment');
    this.proposal = new Api(origin, '/proposal');
    this.user = new Api(origin, '/user');
  }
}

export const BACKEND_URL =
  'http://ec2-54-180-115-206.ap-northeast-2.compute.amazonaws.com';
export default new Router(`${BACKEND_URL}/api`);
