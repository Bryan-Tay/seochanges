const pagespeed_uri = process.env.REACT_APP_PAGESPEED_URI;
const pagespeed_key = process.env.REACT_APP_PAGESPEED_KEY;
const pagespeed_base_uri = `${pagespeed_uri}?key=${pagespeed_key}`;

export const getPageSpeedInsights = async (url) => {
  const req_url = `${pagespeed_base_uri}&url=${encodeURIComponent(url)}`;
  try {
    const response = await fetch(req_url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
