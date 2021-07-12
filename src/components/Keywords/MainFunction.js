import _ from "lodash";
import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useKeywordsContext } from "../../context/KeywordsContext";
import CreditsApi from "../../services/credits";
import { getKeywordData } from "../../services/mangools";
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

  const [byDifficulty, setByDifficulty] = useState(false);

  const handleKeywordResponse = (kw, data) => {
    setLoadingMessage(`Storing data for ${kw} in cache`);
    data["expirationDate"] = new Date().getTime() + 1000 * 60 * 60 * 24 * 14; // 14 days
    localStorage.setItem(`${url}-${kw}`, JSON.stringify(data));
    setFulldata((f) => ({ ...f, [kw]: data }));
  };

  const handleKeywordError = (kw, error) => {
    localStorage.removeItem(`${url}-${kw}`);
    console.log(error);
  };

  useEffect(() => {
    if (!keywords || (Array.isArray(keywords) && !keywords.length)) return;

    for (let kw of keywords) {
      setLoadingMessage(`Getting data for ${kw}`);
      const cachedKw = JSON.parse(localStorage.getItem(`${url}-${kw}`));

      if (
        cachedKw &&
        cachedKw.expirationDate &&
        new Date().getTime() < cachedKw.expirationDate
      ) {
        handleKeywordResponse(kw, cachedKw);
      } else {
        getKeywordData(url, kw, locationData.mangools)
          .then((res) => handleKeywordResponse(kw, res))
          .catch((err) => handleKeywordError(kw, err));
      }
    }
  }, [keywords]);

  useEffect(() => {
    if (!fulldata) return;

    if (Object.keys(fulldata).length === keywords.length) {
      setLoadingMessage("");
    }
  }, [fulldata]);

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
            {byDifficulty ? "Show All" : "Show By Difficulty"}
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
