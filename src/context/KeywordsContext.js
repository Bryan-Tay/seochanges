import React, { createContext, useContext, useEffect, useState } from 'react';

const KeywordsContext = createContext(null);
export const useKeywordsContext = () => useContext(KeywordsContext);

// const testData = {
//   url: 'https://jlccontadores.com.mx',
//   location: 'UnitedStates',
//   locationData: { mangools: 2840, sem: 'us' },
//   keywords: ['contabilidad general', 'servicios contables', 'jlc contadores'],
// };

const KeywordsProvider = ({ children }) => {
  const [data, setData] = useState(null);

  const [errors, setErrors] = useState({});
  const [fulldata, setFulldata] = useState({});

  const [credits, setCredits] = useState({});
  const [loadingMessage, setLoadingMessage] = useState('');

  const [keywords, setKeywords] = useState(null);
  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    if (data) {
      setKeywords(data.keywords || []);
    } else {
      setFulldata({});
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
