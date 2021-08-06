const base_uri = process.env.REACT_APP_CUSTOMAPI;

export const getCredits = async () => {
  const req_url = `${base_uri}/remaining-credits`;
  try {
    const response = await fetch(req_url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const searchEngineSimulator = async (url) => {
  const encodedUri = encodeURIComponent(url);
  const req_url = `${base_uri}/search-engine-simulator?url=${encodedUri}`;
  try {
    const response = await fetch(req_url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
