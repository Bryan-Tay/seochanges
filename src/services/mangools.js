import _ from "lodash";
import axios from "axios";

// Create axios client with default base url and token
const mangoolsWrapper = axios;
mangoolsWrapper.defaults.baseURL = process.env.REACT_APP_KWAPI;
mangoolsWrapper.defaults.headers = {
  "x-access-token": process.env.REACT_APP_KEY,
};

const mangools = mangoolsWrapper.create();

// Coefficients // Currently disabled
const PDA = 0.5;
const UPA = 0.3;
const CF = 0.05;
const TF = 0.05;
const LINKS = 0.05;
const FB = 0.02;
const LPS = 0.03;

// Basically, the score from Mangools multiplied by the coefficients we set above.
const getFinalScore = (meta, emd, aScore) => {
  return (
    Math.round(
      (meta.pda * PDA +
        meta.upa * UPA +
        meta.cf * CF +
        meta.tf * TF +
        meta.links * LINKS +
        meta.fb * FB +
        meta.lps * LPS) *
        emd *
        aScore *
        100
    ) / 100
  );
};

// Function to get whether a domain is EMD or not
const checkEMD = (tempURL, keyword) => {
  let hostname = new URL(tempURL).hostname;
  if (hostname.includes("www.")) {
    hostname = hostname.slice(4);
  }
  let match = hostname.substr(0, hostname.indexOf("."));
  keyword = keyword.replace(/\s+/g, "");

  return match.includes(keyword) || keyword.includes(match) ? 1.5 : 0.5;
};

/**
 * Function to get additional advantage score for keywords being found in sub-url
 * @param {string} url
 * @param {string} kw
 * @returns score depending on kw position inside url
 */
const getAdvantageScore = (url, kw) => {
  let urldata = new URL(url);
  const parsedKw = String(kw).replace(/[^a-z0-9]/gi, "");
  const pathParts = String(url)
    .replace(urldata.origin, urldata.hostname)
    .split("/")
    .map((p) => p.replace(/[^a-z0-9]/gi, ""))
    .filter((p) => p !== "");

  let score = 1;
  const scores = [1.5, 1.2, 1.15, 1.1, 1.05];
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i].includes(parsedKw) || parsedKw.includes(pathParts[i])) {
      score = scores[i];
      break;
    }
  }
  return score;
};

/**
 * Parse kwfinder response and return a set of parameters and calculations for the keyword
 * @param {kwfinder response} data
 * @returns
 */
const mapRelatedKeyword = (data) => {
  let kwdata = data;
  kwdata.evh = kwdata.msv.slice(-12).map((item) => item[2] || 0);
  kwdata.ev = kwdata.evh.reduce((acc, curr) => acc + curr, 0) / 12.0;

  return {
    kw: kwdata.kw,
    search: Math.round((kwdata.sv || 0) * 100) / 100,
    evh: kwdata.evh || [],
    ev: Math.round((kwdata.ev || 0) * 100) / 100,
    cpc: Math.round((kwdata.cpc || 0) * 100) / 100,
    ppc: Math.round((kwdata.ppc || 0) * 100) / 100,
    kd: Math.round((kwdata.seo || 0) * 100) / 100,
  };
};

/**
 * Parse kwfinder response and returns a set of parameters and calculations for the page
 * @param {string} url
 * @param {string} kw
 * @param {kwfinder response} data
 * @returns
 */
const mapRelevantPage = (url, kw, data) => {
  const urldata = new URL(url);
  const emd = checkEMD(url, kw);
  const aScore = getAdvantageScore(url, kw);
  const meta = {
    pda: _.get(data, "m.moz.v.pda", 0),
    upa: _.get(data, "m.moz.v.upa", 0),
    cf: _.get(data, "m.majestic.v.CitationFlow", 0),
    tf: _.get(data, "m.majestic.v.TrustFlow", 0),
    links: _.get(data, "m.majestic.v.ExtBackLinks", 0),
    fb: _.get(data, "m.fb.v.l", 0),
    lps: _.get(data, "m.rank.v.r", 0),
  };

  return {
    url: _.get(data, "url", ""),
    path: urldata.pathname,
    type: _.get(data, "type", ""),
    title: _.get(data, "title", ""),
    domain: _.get(data, "domain", ""),
    score: getFinalScore(meta, emd, aScore),
    aScore: aScore,
    emd: emd,
    meta: meta,
  };
};

/**
 * Gets the current position of the url in the search results
 * @param {kwfinder items response} items
 * @param {string} url
 * @param {string} kw
 * @param {number} df
 * @param {number} offset
 * @returns
 */
const getRanking = (items, url, kw, df, offset) => {
  const domains = items.map((item) => item.domain);
  for (let i = 0; i < domains.length; i++) {
    if (url.includes(domains[i])) {
      return {
        df,
        rank: String(i + offset),
        ...mapRelevantPage(items[i].url, kw, items[i]),
      };
    }
  }
  return false;
};

/**
 * Retrieve the related keywords for a given keyword and location
 * @param {string} url
 * @param {string} keyword
 * @param {number} location
 * @returns
 */
const getRelatedKeywords = async (url, keyword, location) => {
  const relatedKeywords = await mangools.get(
    `/related-keywords?kw=${keyword}&location_id=${location}`
  );

  const [kwdata, ...related] = relatedKeywords.data.keywords
    .filter((kw) => kw.seo)
    .slice(0, 301)
    .map(mapRelatedKeyword);

  return { ...kwdata, related };
};

/**
 * Retrieve relevant page information for a given url, keyword and location
 * @param {string} url
 * @param {string} keyword
 * @param {number} location
 * @returns
 */
const getRelevantPageInfo = async (url, keyword, location) => {
  const relevantPage = await mangools.get(
    `/serps?location_id=${location}&kw=${url + " " + keyword}`
  );

  return mapRelevantPage(url, keyword, relevantPage.data[0].items[0]);
};

const getPageInfo = async (url, keyword, location) => {
  let response;
  let items = [];
  let scores = [];
  let rank = false;

  const apiUrl = `/serps?location_id=${location}&kw=${keyword}`;

  const getPageScores = (res) => {
    let ps = res.data[0].items.map(
      (item) => mapRelevantPage(url, keyword, item).score
    );

    return [...scores, ...ps].sort((a, b) => b - a);
  };

  const dfs = [100, 1.8, 1.4, 1.2, 1.1];
  for (let i = 0; i < dfs.length; i++) {
    let pageQuery = i > 0 ? `&page=${i}` : "";
    if (rank === false) {
      response = await mangools.get(apiUrl + pageQuery);
      rank = getRanking(
        response.data[0].items,
        url,
        keyword,
        dfs[i],
        i * 10 + 1
      );
      items =
        items.length === 0
          ? response.data[0].items.filter((item) => !!item.url)
          : items;
      scores = getPageScores(response);
    } else if (i < 2) {
      response = await mangools.get(apiUrl + pageQuery);
      scores = getPageScores(response);
    } else {
      break;
    }
  }

  return {
    df: rank ? rank.df : 1,
    url: rank ? rank.url : "-",
    path: rank ? rank.path : "-",
    rank: rank ? rank.rank : "50+",
    items: items
      .map((item) => mapRelevantPage(url, keyword, item))
      .filter((item) => !!item.url),
    qs: {
      q1: Math.round(_.mean(scores.slice(0, 5)) * 100) / 100,
      q2: Math.round(_.mean(scores.slice(5, 10)) * 100) / 100,
      q3: Math.round(_.mean(scores.slice(10, 15)) * 100) / 100,
      q4: Math.round(_.mean(scores.slice(15, undefined)) * 100) / 100,
    },
  };
};

const calculateLevel = (pageInfo, relevantPageInfo) => {
  const { score } = relevantPageInfo;
  const { df, qs } = pageInfo;
  if (score * df >= qs.q2) return "low";
  if (score * df >= qs.q3) return "medium";
  if (score * df >= qs.q4) return "high";
  return "others";
};

/**
 * Collect relevant page info, related keyword and page info for a given url, keyword and location
 * @param {string} url
 * @param {string} keyword
 * @param {number} location
 * @returns
 */
export const getKeywordData = async (url, keyword, location) => {
  const relevantPageInfo = await getRelevantPageInfo(url, keyword, location);
  const relatedKeywords = await getRelatedKeywords(url, keyword, location);
  const pageInfo = await getPageInfo(url, keyword, location);
  const level = calculateLevel(pageInfo, relevantPageInfo);

  return {
    ...relevantPageInfo,
    ...relatedKeywords,
    ...pageInfo,
    kw: keyword,
    level,
  };
};

export default mangools;
