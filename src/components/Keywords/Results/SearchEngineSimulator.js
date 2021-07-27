import React, { useEffect, useState } from "react";
import { ExpandMore } from "@material-ui/icons";
import { searchEngineSimulator } from "../../../services/custom";
import { useKeywordsContext } from "../../../context/KeywordsContext";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Grid,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  gridItem: {
    padding: "1rem",
    marginTop: "1rem",
  },
  itemTitle: {
    fontWeight: 800,
  },
  itemValue: {
    fontWeight: 400,
  },
}));

const LoadingPanel = () => <p>Fetching data...</p>;

const NoDataPanel = () => <p>No data found.</p>;

const ResultPanel = ({ data }) => {
  const styles = useStyles();

  const [top, setTop] = useState(5);

  return (
    <Grid container spacing={4}>
      <Grid item xs={4} classnames={styles.gridItem}>
        <Typography classnames={styles.itemTitle}>URL</Typography>
      </Grid>
      <Grid item xs={8} classnames={styles.gridItem}>
        <Typography classnames={styles.itemValue}>{data.resultUrl}</Typography>
      </Grid>
      <Grid item xs={4} classnames={styles.gridItem}>
        <Typography classnames={styles.itemTitle}>Title</Typography>
      </Grid>
      <Grid item xs={8} classnames={styles.gridItem}>
        <Typography classnames={styles.itemValue}>{data.title}</Typography>
      </Grid>
      <Grid item xs={4} classnames={styles.gridItem}>
        <Typography classnames={styles.itemTitle}>Description</Typography>
      </Grid>
      <Grid item xs={8} classnames={styles.gridItem}>
        <Typography classnames={styles.itemValue}>
          {data.description}
        </Typography>
      </Grid>
      <Grid item xs={4} classnames={styles.gridItem}>
        <Typography classnames={styles.itemTitle}>All words</Typography>
      </Grid>
      <Grid item xs={8} classnames={styles.gridItem}>
        <Typography classnames={styles.itemValue}>
          {data.numberOfWords}
        </Typography>
      </Grid>
      <Grid item xs={4} classnames={styles.gridItem}>
        <Typography classnames={styles.itemTitle}>Unique words</Typography>
      </Grid>
      <Grid item xs={8} classnames={styles.gridItem}>
        <Typography classnames={styles.itemValue}>
          {data.numberOfUniqueWords}
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ marginTop: "2rem" }}>
        <FormControl>
          <InputLabel id="top-select-label">
            Display top <i>n</i> phrases
          </InputLabel>
          <Select
            value={top}
            labelId="top-select-label"
            style={{ width: "200px" }}
            onChange={(e) => setTop(e.target.value)}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} classnames={styles.gridItem}>
        <Typography classnames={styles.itemTitle}>Two Word Phrases</Typography>
        <ul>
          {(data.twoWordPhrases || []).slice(0, top).map((item, i) => (
            <li key={i}>
              {item.word} | {item.counter}
            </li>
          ))}
        </ul>
      </Grid>
      <Grid item xs={6} classnames={styles.gridItem}>
        <Typography classnames={styles.itemTitle}>
          Three Word Phrases
        </Typography>
        <ul>
          {(data.threeWordPhrases || []).slice(0, top).map((item, i) => (
            <li key={i}>
              {item.word} | {item.counter}
            </li>
          ))}
        </ul>
      </Grid>
    </Grid>
  );
};

const SearchEngineSimulator = () => {
  const {
    data: { url },
  } = useKeywordsContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const sesResult = await searchEngineSimulator(url);
      setData(sesResult);
    } catch (error) {
      console.log(error);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!url) return;
    loadData();
    // eslint-disable-next-line
  }, [url]);

  return (
    <div style={{ width: "100%", marginTop: "1rem" }}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          id="search-engine-simulator-header"
          aria-controls="search-engine-simulator-content"
        >
          <Typography>Search Engine Simulator</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {loading && <LoadingPanel />}
          {!loading && !data && <NoDataPanel />}
          {!loading && data && <ResultPanel data={data} />}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default SearchEngineSimulator;
