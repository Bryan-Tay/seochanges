import { Button } from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useKeywordsContext } from '../../context/KeywordsContext';
import KwApi from '../../services/keyword';
import CustomPrompt from './Misc/CustomPrompt';
import KeywordPageOneDisplay from './Results/KeywordPageOneDisplay';
import RelatedKeywordTable from './Results/RelatedKeywordTable';
import ResultsDisplay from './Results/ResultsDisplay';

const MainFunction = () => {
  const {
    data,
    setData,
    credits,
    keywords,
    keyword,
    errors,
    setErrors,
    fulldata,
    setFulldata,
    loadingMessage,
    setLoadingMessage,
  } = useKeywordsContext();
  const { url, locationData } = data;

  // Coefficients // Currently disabled
  const [DA] = useState(0.5);
  const [PA] = useState(0.3);
  const [CF] = useState(0.05);
  const [TF] = useState(0.05);
  const [LINKS] = useState(0.05);
  const [FB] = useState(0.02);
  const [LPS] = useState(0.03);

  // Basically, the score from Mangools multiplied by the coefficients we set above.
  const getFS = (da, pa, cf, tf, links, fb, lps, emd) => {
    let fs =
      (da * DA +
        pa * PA +
        cf * CF +
        tf * TF +
        links * LINKS +
        fb * FB +
        lps * LPS) *
      emd;
    return fs;
  };

  // Function to get whether a domain is EMD or not
  const checkEMD = (keyword, tempURL) => {
    let hostname = new URL(tempURL).hostname;
    if (hostname.includes('www.')) {
      hostname = hostname.slice(4);
    }
    let match = hostname.substr(0, hostname.indexOf('.'));
    keyword = keyword.replace(/\s+/g, '');
    if (match.includes(keyword) || keyword.includes(match)) {
      return 1.5;
    } else {
      return 0.5;
    }
  };

  // Get page ranking based on domains
  const getRanking = (kw, items, df, offset) => {
    try {
      const domains = items.map((i) => i.domain);
      for (let i = 0; i < domains.length; i++) {
        if (url.includes(domains[i])) {
          setKeywordAttribute(kw, 'df', df);
          setKeywordAttribute(kw, 'ranking', String(i + offset));
          return true;
        }
      }
      return false;
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [kw]: err,
      }));
      return false;
    }
  };

  // Set fulldata object key => value
  const setKeywordAttribute = (kw, path, value) => {
    setFulldata((fd) => {
      _.set(fd, `${kw}.${path}`, value);
      return { ...fd };
    });
  };

  const onKeywordError = (kw, error) => {
    setData((d) => ({
      ...d,
      keywords: d.keywords.filter((k) => k !== kw),
    }));
    setErrors((err) => ({
      ...err,
      [kw]: String(error),
    }));
  };

  // Store fulldata in sessionStorage on every change
  useEffect(() => {
    for (let kw of Object.keys(fulldata)) {
      const kwData = fulldata[kw];
      sessionStorage.setItem(kw, JSON.stringify(kwData));
      if (
        kwData.fs &&
        kwData.df &&
        kwData.items &&
        kwData.volume &&
        kwData.ranking &&
        kwData.related &&
        kwData.pageData &&
        kwData.pageData.url &&
        kwData.pageData.q2 &&
        kwData.pageData.q3 &&
        kwData.pageData.q4
      ) {
        setLoadingMessage('');
      }
    }
  }, [fulldata]);

  useEffect(() => {
    if (!url || !locationData || !keywords) return;

    const kwapi = new KwApi(url, locationData.mangools);

    setFulldata({});
    for (let kw of keywords) {
      const cachedKw = JSON.parse(sessionStorage.getItem(kw));

      if (
        _.get(cachedKw, 'fs') &&
        _.get(cachedKw, 'df') &&
        _.get(cachedKw, 'items') &&
        _.get(cachedKw, 'volume') &&
        _.get(cachedKw, 'ranking') &&
        _.get(cachedKw, 'related') &&
        _.get(cachedKw, 'pageData') &&
        _.get(cachedKw, 'pageData.url') &&
        _.get(cachedKw, 'pageData.q2') &&
        _.get(cachedKw, 'pageData.q3') &&
        _.get(cachedKw, 'pageData.q4')
      ) {
        // Get data from cache
        setKeywordAttribute(kw, 'fs', cachedKw.fs);
        setKeywordAttribute(kw, 'df', cachedKw.df);
        setKeywordAttribute(kw, 'items', cachedKw.items);
        setKeywordAttribute(kw, 'volume', cachedKw.volume);
        setKeywordAttribute(kw, 'ranking', cachedKw.ranking);
        setKeywordAttribute(kw, 'related', cachedKw.related);
        setKeywordAttribute(kw, 'pageData', cachedKw.pageData);
        setKeywordAttribute(kw, 'pageData.url', cachedKw.pageData.url);
        setKeywordAttribute(kw, 'pageData.q2', cachedKw.pageData.q2);
        setKeywordAttribute(kw, 'pageData.q3', cachedKw.pageData.q3);
        setKeywordAttribute(kw, 'pageData.q4', cachedKw.pageData.q4);
      } else {
        // Getting Search Volume + Related Keywords (svrk)
        setLoadingMessage(`Getting search volume for ${kw}`);
        kwapi
          .getSearchVolume(kw)
          .then((data) => {
            const volume = data.keywords[0].sv || 0;
            setKeywordAttribute(kw, 'volume', volume);
            const related = data.keywords.filter((e) => e.seo).slice(0, 50);
            setKeywordAttribute(kw, 'related', related);
          })
          .catch((err) => onKeywordError(kw, err));

        // Getting most relevant page of submitted data
        setLoadingMessage(`Getting most relevant page for ${kw}`);
        kwapi
          .getRelevantPage(kw)
          .then((data) => {
            const pageUrl = data[0].items[0].url;
            setKeywordAttribute(kw, 'pageData.url', pageUrl);
            const fs = getFS(
              _.get(data[0], 'items[0].m.moz.v.pda', 0),
              _.get(data[0], 'items[0].m.moz.v.upa', 0),
              _.get(data[0], 'items[0].m.majestic.v.CitationFlow', 0),
              _.get(data[0], 'items[0].m.majestic.v.TrustFlow', 0),
              _.get(data[0], 'items[0].m.majestic.v.ExtBackLinks', 0),
              _.get(data[0], 'items[0].m.fb.v.l', 0),
              _.get(data[0], 'items[0].m.rank.v.r', 0),
              checkEMD(kw, url)
            );
            setKeywordAttribute(kw, 'fs', fs);
          })
          .catch((err) => onKeywordError(kw, err));

        setLoadingMessage(`Getting page information for ${kw}`);
        axios
          .all([
            kwapi.getPageInfo(kw, null),
            kwapi.getPageInfo(kw, 1),
            kwapi.getPageInfo(kw, 2),
            kwapi.getPageInfo(kw, 3),
            kwapi.getPageInfo(kw, 4),
          ])
          .catch((err) => onKeywordError(kw, err))
          .then(
            axios.spread((...responses) => {
              const [res1, res2, res3, res4, res5] = responses;

              setKeywordAttribute(kw, 'items', res1[0].items);

              let inRank = false;
              if (!inRank) inRank = getRanking(kw, res1[0].items, 100, 1);
              if (!inRank) inRank = getRanking(kw, res2[0].items, 1.8, 11);
              if (!inRank) inRank = getRanking(kw, res3[0].items, 1.4, 21);
              if (!inRank) inRank = getRanking(kw, res4[0].items, 1.2, 31);
              if (!inRank) inRank = getRanking(kw, res5[0].items, 1.1, 41);
              if (!inRank) {
                setKeywordAttribute(kw, 'df', 1);
                setKeywordAttribute(kw, 'ranking', '50+');
              }

              const pageValues = _.concat(
                res1[0].items.map((i) =>
                  getFS(
                    _.get(i, 'm.moz.v.pda', 0),
                    _.get(i, 'm.moz.v.upa', 0),
                    _.get(i, 'm.majestic.v.CitationFlow', 0),
                    _.get(i, 'm.majestic.v.TrustFlow', 0),
                    _.get(i, 'm.majestic.v.ExtBackLinks', 0),
                    _.get(i, 'm.fb.v.l', 0),
                    _.get(i, 'm.rank.v.r', 0),
                    checkEMD(kw, `https://mbg.com.sg:8081/https://${i.domain}/`)
                  )
                ),
                res2[0].items.map((i) =>
                  getFS(
                    _.get(i, 'm.moz.v.pda', 0),
                    _.get(i, 'm.moz.v.upa', 0),
                    _.get(i, 'm.majestic.v.CitationFlow', 0),
                    _.get(i, 'm.majestic.v.TrustFlow', 0),
                    _.get(i, 'm.majestic.v.ExtBackLinks', 0),
                    _.get(i, 'm.fb.v.l', 0),
                    _.get(i, 'm.rank.v.r', 0),
                    checkEMD(kw, `https://mbg.com.sg:8081/https://${i.domain}/`)
                  )
                )
              ).sort((a, b) => b - a);

              const q2 = _.mean([
                pageValues[5],
                pageValues[6],
                pageValues[7],
                pageValues[8],
                pageValues[9],
              ]);

              const q3 = _.mean([
                pageValues[10],
                pageValues[11],
                pageValues[12],
                pageValues[13],
                pageValues[14],
              ]);

              const q4 = _.mean(pageValues.slice(14));

              setKeywordAttribute(kw, 'pageData.q2', q2);
              setKeywordAttribute(kw, 'pageData.q3', q3);
              setKeywordAttribute(kw, 'pageData.q4', q4);
            })
          );
      }
    }
  }, [keywords]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <CustomPrompt />
          <h2>
            Checking {url} in {locationData.sem.toUpperCase()}
          </h2>
          <p>Credits used for this search: {credits}</p>
          {!!loadingMessage && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ClipLoader size={10} color={'#123abc'} />
              <p style={{ marginLeft: '8px', fontSize: '14px' }}>
                {loadingMessage}
              </p>
            </div>
          )}
        </div>
        <Button
          color='primary'
          variant='contained'
          onClick={() => setData(null)}
        >
          Reset
        </Button>
      </div>

      <ResultsDisplay />
      {errors &&
        Object.entries(errors).map(([kw, error]) => (
          <p>
            An error has ocurred for <strong>{kw}</strong>: {error}
          </p>
        ))}
      {keyword && (
        <div>
          <KeywordPageOneDisplay />
          <div style={{ display: 'flex' }}>
            <RelatedKeywordTable type='Low' />
            <RelatedKeywordTable type='Medium' />
            <RelatedKeywordTable type='Hard' />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainFunction;
