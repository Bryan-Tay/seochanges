import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";
import countries from "../catalogs/countries";
import { getCredits } from "../services/custom";
import { getKeywordData } from "../services/mangools";

const KeywordsContext = createContext();
export const useKeywords = () => useContext(KeywordsContext);

const KeywordsProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  const [url, setUrl] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [keyword, setKeyword] = useState(null);

  const [status, setStatus] = useState("");
  const [keywordsData, setKeywordsData] = useState(null);

  useEffect(() => {
    setInitialized(!!url && !!location && !!locationData && !!keywords);
    setKeywordsData({});

    if ((url, location, locationData, keywords)) {
      for (let kw of keywords) {
        const key = `${url}-${kw}`;
        setStatus(`Retrieving data for ${kw}`);

        const cachedKw = JSON.parse(localStorage.getItem(key));
        setStatus(`Searching cached data for ${kw}`);

        if (
          cachedKw &&
          cachedKw.level &&
          cachedKw.expirationDate &&
          new Date().getTime() < cachedKw.expirationDate
        ) {
          setStatus(`Getting data for ${kw} from cache`);
          setKeywordsData((k) => ({ ...k, [kw]: cachedKw }));
          setStatus("");
        } else {
          refreshKeyword(kw);
        }
      }
    }
  }, [url, location, locationData, keywords]);

  const reset = async () => {
    await setInitialized(false);
    await setLocationData(null);
    await setLocation(null);
    await setKeywords(null);
    await setUrl(null);
  };

  const submitForm = ({ url, location, keywords }) => {
    setUrl(url[url.length - 1] !== "/" ? url + "/" : url);
    setLocation(location);
    setLocationData(countries[location]);
    setKeywords([
      ...new Set(
        keywords
          .replace(/\n/g, ",")
          .split(",")
          .map((kw) => String(kw).toLowerCase().trim())
          .filter((kw) => !!kw) || []
      ),
    ]);
  };

  const addKeyword = (kw) => {
    const parsedKw = String(kw).toLowerCase().trim();
    if ((keywords || []).indexOf(parsedKw) === -1) {
      setKeywords((kwds) => [...kwds, parsedKw]);
    }
  };

  const removeKeyword = (kw) => {
    const parsedKw = String(kw).toLowerCase().trim();
    const kwIndex = (keywords || []).indexOf(parsedKw);
    if (kwIndex > -1) {
      setKeywords((kwds) => kwds.filter((kwd) => kwd !== kw));
      localStorage.removeItem(`${url}-${kw}`);
    }
  };

  const refreshKeyword = (kw) => {
    const key = `${url}-${kw}`;
    setStatus(`Requesting data for ${kw}`);
    getKeywordData(url, kw, locationData.mangools)
      .then((kwdata) => {
        setStatus(`Storing data for ${kw}`);
        let data = kwdata;
        data["kw"] = kw;
        data["expirationDate"] =
          new Date().getTime() + 1000 * 60 * 60 * 24 * 14;
        localStorage.setItem(key, JSON.stringify(data));
        setKeywordsData((k) => ({ ...k, [kw]: data }));
        getCreditBalance();
        setStatus("");
      })
      .catch((err) => {
        setStatus(`An error ocurred for ${kw}`);
        localStorage.removeItem(key);
        getCreditBalance();
        console.log(err);
        setStatus("");
      });
  };

  const setActiveKeyword = (kw) => {
    setKeyword(kw && keywordsData[kw] ? keywordsData[kw] : null);
  };

  /**
   * Update credit balance
   */

  const [credits, setCredits] = useState({});
  const [loadingCredits, setLoadingCredits] = useState(true);
  const getCreditBalance = () => {
    setLoadingCredits(true);
    getCredits().then((res) => {
      setCredits(res.credits);
      setLoadingCredits(false);
    });
  };

  useEffect(() => {
    getCreditBalance();
    // eslint-disable-next-line
  }, []);

  /**
   * Toggle by category
   */

  const [byCategory, setByCategory] = useState(false);
  const toggleByCategory = () => {
    setByCategory((value) => !value);
  };

  return (
    <KeywordsContext.Provider
      value={{
        initialized,
        status,
        url,
        location,
        locationData,
        keywords,
        keywordsData,
        keyword,
        credits,
        loadingCredits,
        byCategory,
        reset,
        submitForm,
        addKeyword,
        removeKeyword,
        refreshKeyword,
        setActiveKeyword,
        toggleByCategory,
      }}
    >
      {children}
    </KeywordsContext.Provider>
  );
};

export default KeywordsProvider;
