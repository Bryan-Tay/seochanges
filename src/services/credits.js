import axios from 'axios';

class CreditsApi {
  client;

  constructor() {
    const creditsApi = axios;
    creditsApi.defaults.baseURL = process.env.REACT_APP_CREDITSAPI;
    creditsApi.defaults.headers = {
      'x-access-token': process.env.REACT_APP_KEY,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    this.client = creditsApi.create();
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        return new Error(
          error.message ||
            error.response.data.error.message ||
            'An Error Ocurred'
        );
      }
    );
  }

  async getCredits() {
    return this.client.get('/remaining-credits');
  }
}

export default CreditsApi;
