const base_uri = process.env.REACT_APP_CUSTOMAPI;
const pagespeed_uri = `${base_uri}/pagespeed-insights`;

export const getPageSpeedInsights = async (url, device = "mobile") => {
  const encUrl = encodeURIComponent(url);
  const req_url = `${pagespeed_uri}?url=${encUrl}&device=${device}`;
  try {
    const response = await fetch(req_url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
