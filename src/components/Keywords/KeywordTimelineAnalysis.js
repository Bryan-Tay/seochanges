import React from 'react';
import { useKeywordsContext } from '../../context/KeywordsContext';
import MainFunction from './MainFunction';
import UserInput from './UserInput';

const KeywordTimelineAnalysis = () => {
  const { data, loading } = useKeywordsContext();

  if (!data || loading) {
    return <UserInput />;
  }

  return (
    <MainFunction
      url={data.url}
      keywords={data.keywords}
      location={data.locationData}
    />
  );
};

export default KeywordTimelineAnalysis;
