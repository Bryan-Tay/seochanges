import { Button } from "@material-ui/core";
import axios from "axios";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useKeywordsContext } from "../../context/KeywordsContext";
import CreditsApi from "../../services/credits";
import KwApi from "../../services/keyword";
import CustomPrompt from "./Misc/CustomPrompt";
import KeywordPageOneDisplay from "./Results/KeywordPageOneDisplay";
import RelatedKeywordTable from "./Results/RelatedKeywordTable";
import ResultsDisplay from "./Results/ResultsDisplay";

const MainFunction = () => {
  const {
    data,
    setData,
    credits,
    setCredits,
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

  const [byDifficulty, setByDifficulty] = useState(false);

  const seoCategories = [
    [0, 30, "low"],
    [30, 60, "medium"],
    [60, 100, "hight"],
  ];

  const getSeoLevel = (seo = 0) => {
    const category = seoCategories.find((cat) => cat[0] <= seo && seo < cat[1]);
    return category[2];
  };

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
    if (hostname.includes("www.")) {
      hostname = hostname.slice(4);
    }
    let match = hostname.substr(0, hostname.indexOf("."));
    keyword = keyword.replace(/\s+/g, "");
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
          setKeywordAttribute(kw, "df", df);
          setKeywordAttribute(kw, "ranking", String(i + offset));
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

  const [loadingCredits, setLoadingCredits] = useState(true);
  const getCredits = () => {
    const creditsApi = new CreditsApi();
    setLoadingCredits(true);
    creditsApi.getCredits().then((res) => {
      setCredits(res.credits);
      setLoadingCredits(false);
    });
  };

  useEffect(() => {
    getCredits();
  }, []);

  // Store fulldata in localStorage on every change
  useEffect(() => {
    if (!keywords || !fulldata) return;

    let status = new Array(keywords.length).fill(false);
    for (let kw of keywords) {
      let kwData = fulldata[kw] || {};
      if (
        kwData.fs !== undefined &&
        kwData.df !== undefined &&
        kwData.seo !== undefined &&
        kwData.items !== undefined &&
        kwData.volume !== undefined &&
        kwData.ranking !== undefined &&
        kwData.related !== undefined &&
        kwData.seoLevel !== undefined &&
        kwData.pageData !== undefined &&
        kwData.pageData.url !== undefined &&
        kwData.pageData.q2 !== undefined &&
        kwData.pageData.q3 !== undefined &&
        kwData.pageData.q4 !== undefined
      ) {
        kwData["expirationDate"] =
          new Date().getTime() + 1000 * 60 * 60 * 24 * 14; // 14 days
        localStorage.setItem(`${url}-${kw}`, JSON.stringify(kwData));
        status[keywords.indexOf(kw)] = true;
      }
    }

    const isComplete = status.filter((s) => s).length === status.length;
    if (isComplete) {
      setLoadingMessage("");
      getCredits();
    }
  }, [keywords, fulldata]);

  useEffect(() => {
    if (!url || !locationData || !keywords) return;

    const kwapi = new KwApi(url, locationData.mangools);

    setFulldata({});
    for (let kw of keywords) {
      const cachedKw = JSON.parse(localStorage.getItem(`${url}-${kw}`));

      if (
        new Date().getTime() < _.get(cachedKw, "expirationDate") &&
        _.get(cachedKw, "fs") !== undefined &&
        _.get(cachedKw, "df") !== undefined &&
        _.get(cachedKw, "seo") !== undefined &&
        _.get(cachedKw, "items") !== undefined &&
        _.get(cachedKw, "volume") !== undefined &&
        _.get(cachedKw, "ranking") !== undefined &&
        _.get(cachedKw, "related") !== undefined &&
        _.get(cachedKw, "seoLevel") !== undefined &&
        _.get(cachedKw, "pageData") !== undefined &&
        _.get(cachedKw, "pageData.url") !== undefined &&
        _.get(cachedKw, "pageData.q2") !== undefined &&
        _.get(cachedKw, "pageData.q3") !== undefined &&
        _.get(cachedKw, "pageData.q4") !== undefined
      ) {
        // Get data from cache
        setKeywordAttribute(kw, "fs", cachedKw.fs);
        setKeywordAttribute(kw, "df", cachedKw.df);
        setKeywordAttribute(kw, "seo", cachedKw.seo);
        setKeywordAttribute(kw, "items", cachedKw.items);
        setKeywordAttribute(kw, "volume", cachedKw.volume);
        setKeywordAttribute(kw, "ranking", cachedKw.ranking);
        setKeywordAttribute(kw, "related", cachedKw.related);
        setKeywordAttribute(kw, "seoLevel", cachedKw.seoLevel);
        setKeywordAttribute(kw, "pageData", cachedKw.pageData);
        setKeywordAttribute(kw, "pageData.url", cachedKw.pageData.url);
        setKeywordAttribute(kw, "pageData.q2", cachedKw.pageData.q2);
        setKeywordAttribute(kw, "pageData.q3", cachedKw.pageData.q3);
        setKeywordAttribute(kw, "pageData.q4", cachedKw.pageData.q4);
      } else {
        // Getting Search Volume + Related Keywords (svrk)
        setLoadingMessage(`Getting search volume for ${kw}`);
        kwapi
          .getSearchVolume(kw)
          .then((data) => {
            const seo = _.get(data, "keywords[0].seo", 0);
            setKeywordAttribute(kw, "seo", seo);
            const seoLevel = getSeoLevel(seo);
            setKeywordAttribute(kw, "seoLevel", seoLevel);
            const volume = _.get(data, "keywords[0].sv", 0);
            setKeywordAttribute(kw, "volume", volume);
            const related = data.keywords
              .filter((kw) => kw.seo)
              .slice(0, 300)
              .map((kw) => ({
                ...kw,
                seoLevel: getSeoLevel(kw.seo),
              }));
            setKeywordAttribute(kw, "related", related);
          })
          .catch((err) => onKeywordError(kw, err));

        // Getting most relevant page of submitted data
        setLoadingMessage(`Getting most relevant page for ${kw}`);
        kwapi
          .getRelevantPage(kw)
          .then((data) => {
            let pageUrl = _.get(data, "[0].items[0].url", "");
            pageUrl = pageUrl.slice(url.length - 1);
            setKeywordAttribute(kw, "pageData.url", pageUrl);
            const fs = getFS(
              _.get(data[0], "items[0].m.moz.v.pda", 0),
              _.get(data[0], "items[0].m.moz.v.upa", 0),
              _.get(data[0], "items[0].m.majestic.v.CitationFlow", 0),
              _.get(data[0], "items[0].m.majestic.v.TrustFlow", 0),
              _.get(data[0], "items[0].m.majestic.v.ExtBackLinks", 0),
              _.get(data[0], "items[0].m.fb.v.l", 0),
              _.get(data[0], "items[0].m.rank.v.r", 0),
              checkEMD(kw, url)
            );
            setKeywordAttribute(kw, "fs", fs);
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

              setKeywordAttribute(kw, "items", _.get(res1, "[0].items", []));

              let inRank = false;
              if (!inRank)
                inRank = getRanking(kw, _.get(res1, "[0].items", []), 100, 1);
              if (!inRank)
                inRank = getRanking(kw, _.get(res2, "[0].items", []), 1.8, 11);
              if (!inRank)
                inRank = getRanking(kw, _.get(res3, "[0].items", []), 1.4, 21);
              if (!inRank)
                inRank = getRanking(kw, _.get(res4, "[0].items", []), 1.2, 31);
              if (!inRank)
                inRank = getRanking(kw, _.get(res5, "[0].items", []), 1.1, 41);
              if (!inRank) {
                setKeywordAttribute(kw, "df", 1);
                setKeywordAttribute(kw, "ranking", "50+");
              }

              const pageValues = _.concat(
                _.get(res1, "[0].items", []).map((i) =>
                  getFS(
                    _.get(i, "m.moz.v.pda", 0),
                    _.get(i, "m.moz.v.upa", 0),
                    _.get(i, "m.majestic.v.CitationFlow", 0),
                    _.get(i, "m.majestic.v.TrustFlow", 0),
                    _.get(i, "m.majestic.v.ExtBackLinks", 0),
                    _.get(i, "m.fb.v.l", 0),
                    _.get(i, "m.rank.v.r", 0),
                    checkEMD(kw, `https://mbg.com.sg:8081/https://${i.domain}/`)
                  )
                ),
                _.get(res2, "[0].items", []).map((i) =>
                  getFS(
                    _.get(i, "m.moz.v.pda", 0),
                    _.get(i, "m.moz.v.upa", 0),
                    _.get(i, "m.majestic.v.CitationFlow", 0),
                    _.get(i, "m.majestic.v.TrustFlow", 0),
                    _.get(i, "m.majestic.v.ExtBackLinks", 0),
                    _.get(i, "m.fb.v.l", 0),
                    _.get(i, "m.rank.v.r", 0),
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

              setKeywordAttribute(kw, "pageData.q2", q2);
              setKeywordAttribute(kw, "pageData.q3", q3);
              setKeywordAttribute(kw, "pageData.q4", q4);
            })
          );
      }
    }
  }, [keywords]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <CustomPrompt />
          <h2>
            Checking {url} in {locationData.sem.toUpperCase()}
          </h2>
          <p>
            Credit Balance:
            {loadingCredits ? (
              <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
                Loading...
              </span>
            ) : (
              <>
                <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
                  {_.get(credits, "kw.remaining", 0)}
                </span>
                {" / "}
                <span style={{ fontWeight: "bold" }}>
                  {_.get(credits, "kw.total", 0)}
                </span>
              </>
            )}
          </p>
          <p>
            Time to Reset:
            {loadingCredits ? (
              <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
                Loading...
              </span>
            ) : (
              <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
                {_.get(credits, "ttr", "Fully charged")}
              </span>
            )}
          </p>
          {!!loadingMessage && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <ClipLoader size={10} color={"#123abc"} />
              <p style={{ marginLeft: "8px", fontSize: "14px" }}>
                {loadingMessage}
              </p>
            </div>
          )}
        </div>
        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setByDifficulty((byCat) => !byCat)}
          >
            {byDifficulty ? 'Show All' : 'Show By Difficulty'}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setData(null)}
            style={{ marginLeft: "1rem" }}
          >
            Reset
          </Button>
        </div>
      </div>

      <ResultsDisplay byDifficulty={byDifficulty} />
      {errors &&
        Object.entries(errors).map(([kw, error]) => (
          <p>
            An error has ocurred for <strong>{kw}</strong>: {error}
          </p>
        ))}
      {keyword && (
        <div>
          <KeywordPageOneDisplay />
          <div style={{ display: "flex" }}>
            <RelatedKeywordTable type="Low" />
            <RelatedKeywordTable type="Medium" />
            <RelatedKeywordTable type="Hard" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainFunction;
