import {
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import _ from "lodash";
import { ExpandMore } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useKeywords } from "../../hooks/useKeywords";
import { getPageSpeedInsights } from "../../services/pagespeed-insights";

const useStyles = makeStyles(() => ({
  title: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  score: {
    display: "block",
    marginTop: "1rem",
    marginBottom: "2rem",
    fontWeight: "bolder",
  },
  tableCell: {
    fontWeight: "bold",
    borderBottom: "none",
  },
}));

const COLORS = {
  default: "#636363",
  SLOW: "#ff4e42",
  AVERAGE: "#ffa400",
  FAST: "#0cce6b",
};

const PageSpeedDevice = ({ data }) => {
  const styles = useStyles();

  const [scoreColor, setScoreColor] = useState(COLORS["default"]);
  useEffect(() => {
    if (data && data.score) {
      if (data.score < 49) {
        setScoreColor(COLORS["SLOW"]);
      } else if (data.score < 89) {
        setScoreColor(COLORS["AVERAGE"]);
      } else {
        setScoreColor(COLORS["FAST"]);
      }
    } else {
      setScoreColor(COLORS["default"]);
    }
  }, [data]);

  return (
    <>
      <Typography variant="h6" className={styles.title}>
        {_.get(data, "device", "Loading...")}
      </Typography>
      <Typography
        variant="h3"
        className={styles.score}
        style={{ color: scoreColor }}
      >
        {_.get(data, "score", <CircularProgress />)}
      </Typography>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell className={styles.tableCell}>
              Largest Contentful Paint
            </TableCell>
            <TableCell
              className={styles.tableCell}
              style={{
                color: COLORS[_.get(data, "web_vitals.lcp", "default")],
              }}
            >
              {_.get(data, "web_vitals.lcp", <CircularProgress size={16} />)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.tableCell}>
              First Input Delay
            </TableCell>
            <TableCell
              className={styles.tableCell}
              style={{
                color: COLORS[_.get(data, "web_vitals.fid", "default")],
              }}
            >
              {_.get(data, "web_vitals.fid", <CircularProgress size={16} />)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={styles.tableCell}>
              Cumulative Layout Shift
            </TableCell>
            <TableCell
              className={styles.tableCell}
              style={{
                color: COLORS[_.get(data, "web_vitals.cls", "default")],
              }}
            >
              {_.get(data, "web_vitals.cls", <CircularProgress size={16} />)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

const PageSpeedInsights = () => {
  const { url } = useKeywords();

  const [mobile, setMobile] = useState(null);
  const [desktop, setDesktop] = useState(null);

  useEffect(() => {
    if (!url) return;
    // get page speed insights for mobile
    getPageSpeedInsights(url, "mobile")
      .then((data) => {
        setMobile(data);
      })
      .catch((error) => {
        console.log(error);
        setMobile(null);
      });
    // get page speed insights for desktop
    getPageSpeedInsights(url, "desktop")
      .then((data) => {
        setDesktop(data);
      })
      .catch((error) => {
        console.log(error);
        setDesktop(null);
      });
  }, [url]);

  return (
    <div style={{ width: "100%" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          id="page-speed-insights-header"
          aria-controls="page-speed-insights-content"
        >
          <Typography>PageSpeed Insights</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <PageSpeedDevice data={mobile} />
            </Grid>
            <Grid item xs={6}>
              <PageSpeedDevice data={desktop} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default PageSpeedInsights;
