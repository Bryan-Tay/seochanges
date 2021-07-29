import _ from "lodash";
import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { ClipLoader } from "react-spinners";
import PageSpeedInsights from "../components/KeywordTimelineAnalysis/PageSpeedInsights";
import ResultsTable from "../components/KeywordTimelineAnalysis/ResultsTable";
import SearchEngineSimulator from "../components/KeywordTimelineAnalysis/SearchEngineSimulator";
import UserInput from "../components/KeywordTimelineAnalysis/UserInput";
import { useKeywords } from "../hooks/useKeywords";
import KeywordPageOneDisplay from "../components/KeywordTimelineAnalysis/KeywordPageOneDisplay";
import RelatedKeywordTable from "../components/KeywordTimelineAnalysis/RelatedKeywordTable";

const useStyles = makeStyles((theme) => ({
  topBar: {
    display: "flex",
    marginTop: "2rem",
    marginBottom: "1rem",
    alignItems: "center",
    justifyContent: "space-between",
  },
  creditBalance: {
    fontWeight: "bold",
  },
  statusContainer: { display: "flex", alignItems: "center" },
  statusText: { marginLeft: "8px", fontSize: "14px" },
  accordion: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const KeywordTimelineAnalysis = () => {
  const classes = useStyles();
  const {
    url,
    status,
    keyword,
    initialized,
    locationData,
    reset,
    credits,
    loadingCredits,
    byCategory,
    toggleByCategory,
  } = useKeywords();

  return !initialized ? (
    <UserInput />
  ) : (
    <>
      <h2>
        Checking {url} in {locationData.sem.toUpperCase()}
      </h2>
      <div className={classes.accordion}>
        <PageSpeedInsights />
        <SearchEngineSimulator />
      </div>
      <div className={classes.topBar}>
        <div>
          <p>
            Credit Balance:{" "}
            {loadingCredits ? (
              <span className={classes.creditBalance}>Loading...</span>
            ) : (
              <>
                <span className={classes.creditBalance}>
                  {_.get(credits, "kw.remaining", 0)}
                  {" / "}
                  {_.get(credits, "kw.total", 0)}
                </span>
              </>
            )}
          </p>
          <p>
            Time to Reset:{" "}
            {loadingCredits ? (
              <span className={classes.creditBalance}>Loading...</span>
            ) : (
              <span className={classes.creditBalance}>
                {_.get(credits, "ttr", "Fully charged")}
              </span>
            )}
          </p>
          {!!status && (
            <div className={classes.statusContainer}>
              <ClipLoader size={10} color={"#123abc"} />
              <p className={classes.statusText}>{status}</p>
            </div>
          )}
        </div>
        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={toggleByCategory}
          >
            {byCategory ? "Show All" : "Show By Difficulty"}
          </Button>
          <Button
            onClick={reset}
            color="primary"
            variant="contained"
            style={{ marginLeft: "1rem" }}
          >
            Reset
          </Button>
        </div>
      </div>
      <ResultsTable />
      {keyword && (
        <div>
          <p>
            <b>Disclaimer:</b>
            <br />
            Categorisation of related keywords and main sheet for competition
            levels vary because app further computes localised aspects of the
            keyword in relation to the target URL.
          </p>
          <KeywordPageOneDisplay />
          <div style={{ display: "flex" }}>
            <RelatedKeywordTable type="Low" />
            <RelatedKeywordTable type="Medium" />
            <RelatedKeywordTable type="Hard" />
          </div>
        </div>
      )}
    </>
  );
};

export default KeywordTimelineAnalysis;
