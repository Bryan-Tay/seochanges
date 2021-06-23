import React, { createContext, useContext, useEffect, useState } from "react";

const KeywordsContext = createContext(null);
export const useKeywordsContext = () => useContext(KeywordsContext);

const defData = {
  url: "https://www.edmaro.com.sg/",
  location: "Singapore",
  locationData: { mangools: 2702, sem: "sg" },
  keywords: [
    // "corporate gifts",
    // "corporate gift",
    // "corporate gifts singapore",
    // "corporate gift singapore",
    // "corporate gifts supplier",
    "corporate gifts supplier signapore",
    // "customised corporate gifts",
    // "customised corporate gifts singapore",
    // "corporate gifts ideas",
    // "corporate gifts ideas singapore",
  ],
};

const KeywordsProvider = ({ children }) => {
  const [data, setData] = useState(defData);

  const [errors, setErrors] = useState({});
  const [fulldata, setFulldata] = useState({});

  const [credits, setCredits] = useState({});
  const [loadingMessage, setLoadingMessage] = useState("");

  const [keywords, setKeywords] = useState([]);
  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    if (data) {
      let kws = data.keywords.map((kw) => String(kw).toLowerCase().trim());
      setKeywords([...new Set(kws || [])]);
    } else {
      setFulldata({});
      setKeywords([]);
      setKeyword(null);
      setErrors({});
    }
  }, [data]);

  return (
    <KeywordsContext.Provider
      value={{
        data,
        setData,
        errors,
        setErrors,
        fulldata,
        setFulldata,
        credits,
        setCredits,
        loadingMessage,
        setLoadingMessage,
        keywords,
        setKeywords,
        keyword,
        setKeyword,
      }}
    >
      {children}
    </KeywordsContext.Provider>
  );
};

export default KeywordsProvider;
