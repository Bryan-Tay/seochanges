import axios from "axios";

const customapiWrapper = axios;
customapiWrapper.defaults.baseURL = process.env.REACT_APP_CUSTOMAPI;
customapiWrapper.defaults.headers = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Origin": "*",
};

const customapi = customapiWrapper.create();

export const getCredits = async () => {
  try {
    const response = await customapi.get("/remaining-credits");
    return response.data;
  } catch (error) {
    return new Error(
      error.message || error.response.data.error.message || "An Error Ocurred"
    );
  }
};

export const searchEngineSimulator = async (url) => {
  try {
    const encodedUri = encodeURIComponent(url);
    const response = await customapi.get(
      `/search-engine-simulator?url=${encodedUri}`
    );
    return response.data;
  } catch (error) {
    return new Error(
      error.message || error.response.data.error.message || "An Error Ocurred"
    );
  }
};
