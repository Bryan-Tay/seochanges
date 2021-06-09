import React, { createContext, useContext, useEffect, useState } from 'react';
import countries from '../catalogs/countries';

const KeywordsContext = createContext(null);
export const useKeywordsContext = () => useContext(KeywordsContext);

const KeywordsProvider = ({ children }) => {
  const [data, setData] = useState(null);

  const [errors, setErrors] = useState({});
  const [fulldata, setFulldata] = useState({});

  const [credits, setCredits] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [keywords, setKeywords] = useState(null);
  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    if (data) {
      setKeywords(data.keywords || []);
    } else {
      setKeywords([]);
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
