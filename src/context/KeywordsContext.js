import React, { createContext, useContext, useEffect, useState } from 'react';

const KeywordsContext = createContext(null);
export const useKeywordsContext = () => useContext(KeywordsContext);

const testData = {
  url: 'https://mediaonemarketing.com.sg/',
  location: 'Singapore',
  locationData: { mangools: 2702, sem: 'sg' },
  keywords: ['help', 'media on marketing', 'marketing', 'help marketing'],
};

const KeywordsProvider = ({ children }) => {
  const [data, setData] = useState(testData);

  const [errors, setErrors] = useState({});
  const [fulldata, setFulldata] = useState({});

  const [credits, setCredits] = useState({});
  const [loadingMessage, setLoadingMessage] = useState('');

  const [keywords, setKeywords] = useState([]);
  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    if (data) {
      setKeywords(data.keywords || []);
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
