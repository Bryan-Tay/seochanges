import axios from 'axios';

class KwApi {
  client;

  url;
  location;

  constructor(url, location) {
    const kwapi = axios;
    kwapi.defaults.baseURL =
      'https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder';
    kwapi.defaults.headers = {
      'x-access-token': process.env.REACT_APP_KEY,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    this.url = url;
    this.location = location;
    this.client = kwapi.create();
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        return new Error(
          error.isAxiosError ? error.response.data.error.message : error.message
        );
      }
    );
  }

  getSearchVolume(keyword) {
    return this.client.get(
      `/related-keywords/?kw=${keyword}&location_id=${this.location}`
    );
  }

  getRelevantPage(keyword) {
    return this.client.get(
      `/serps/?kw=${this.url}%20${keyword}&location_id=${this.location}`
    );
  }

  getPageInfo(keyword, page = null) {
    const pageQuery = page ? `&page=${page}` : '';
    return this.client.get(
      `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${keyword}&location_id=${this.location}${pageQuery}`
    );
  }
}

export default KwApi;
