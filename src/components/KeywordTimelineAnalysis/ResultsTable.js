import _ from "lodash";
import {
  Button,
  FormControl,
  FormHelperText,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useKeywords } from "../../hooks/useKeywords";
import ResultsTableSection from "./ResultsTableSection";
import { Controller, useForm } from "react-hook-form";
import SummaryCards from "./SummaryCards";
import { TableExport } from "tableexport";

const useStyles = makeStyles((theme) => ({
  bottomBar: {
    display: "flex",
    marginTop: theme.spacing(4),
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const ResultsTable = () => {
  const classes = useStyles();
  const { control, handleSubmit, setValue } = useForm();
  const { keywordsData, addKeyword, byCategory } = useKeywords();

  /**
   * Sort rows by attribute
   */

  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const Sortable = ({ property, label, tooltip = null }) =>
    tooltip ? (
      <Tooltip title={tooltip}>
        <TableSortLabel
          active={orderBy === property}
          onClick={() => handleRequestSort(property)}
          direction={orderBy === property ? order : "asc"}
        >
          {label}
        </TableSortLabel>
      </Tooltip>
    ) : (
      <TableSortLabel
        active={orderBy === property}
        onClick={() => handleRequestSort(property)}
        direction={orderBy === property ? order : "asc"}
      >
        {label}
      </TableSortLabel>
    );

  /**
   * Categorize keywords
   */

  const [lowData, setLowData] = useState({});
  const [mediumData, setMediumData] = useState({});
  const [highData, setHighData] = useState({});
  const [othersData, setOthersData] = useState({});
  useEffect(() => {
    let low = {};
    let medium = {};
    let high = {};
    let others = {};
    for (let [kw, kwdata] of Object.entries(keywordsData)) {
      if (kwdata.score * kwdata.df >= kwdata.qs.q2) {
        low[kw] = kwdata;
      } else if (
        kwdata.score * kwdata.df < kwdata.qs.q2 &&
        kwdata.score * kwdata.df >= kwdata.qs.q3
      ) {
        medium[kw] = kwdata;
      } else if (
        kwdata.score * kwdata.df < kwdata.qs.q3 &&
        kwdata.score * kwdata.df >= kwdata.qs.q4
      ) {
        high[kw] = kwdata;
      } else {
        others[kw] = kwdata;
      }
    }

    setLowData(low);
    setMediumData(medium);
    setHighData(high);
    setOthersData(others);
  }, [keywordsData]);

  const onSubmit = async ({ keyword }) => {
    setValue("keyword", "");
    addKeyword(keyword);
  };

  return (
    <>
      <Table size="small" id="main-table" aria-label="keywords results table">
        <TableHead>
          <TableRow>
            <TableCell>Keyword</TableCell>
            <TableCell>
              <Sortable property="kd" label="Magic Score" />
            </TableCell>
            <TableCell>
              <Sortable property="rank" label="Current Rank" />
            </TableCell>
            <TableCell>
              <Sortable property="search" label="Search Volume" />
            </TableCell>
            <TableCell>
              <Sortable
                label="EV"
                property="ev"
                tooltip="Estimated Visits Per Month (last 12 months)"
              />
            </TableCell>
            <TableCell>
              <Sortable
                label="CPC"
                property="cpc"
                tooltip="Average Cost Per Click"
              />
            </TableCell>
            <TableCell>
              <Sortable label="PPC" property="ppc" tooltip="Pay Per Click" />
            </TableCell>
            <TableCell>4 - 6 Months</TableCell>
            <TableCell>7 - 9 Months</TableCell>
            <TableCell>10 - 12 Months</TableCell>
            <TableCell>12+ Months</TableCell>
            <TableCell>URL</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!byCategory ? (
            <ResultsTableSection
              data={_.merge(lowData, mediumData, highData, othersData)}
              orderBy={orderBy}
              order={order}
            />
          ) : (
            <>
              <ResultsTableSection
                subheader="Low"
                data={lowData}
                orderBy={orderBy}
                order={order}
              />
              <ResultsTableSection
                subheader="Medium"
                data={mediumData}
                orderBy={orderBy}
                order={order}
              />
              <ResultsTableSection
                subheader="High"
                data={highData}
                orderBy={orderBy}
                order={order}
              />
              <ResultsTableSection
                subheader="Others"
                data={othersData}
                orderBy={orderBy}
                order={order}
              />
            </>
          )}
        </TableBody>
      </Table>
      <div className={classes.bottomBar}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormControl fullWidth margin="normal">
            <Controller
              name="keyword"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="text"
                  placeholder="i.e. seo services singapore"
                />
              )}
            />
            <FormHelperText>Add More Keywords (enter to submit)</FormHelperText>
          </FormControl>
        </form>
        <SummaryCards low={lowData} medium={mediumData} high={highData} />
        <Button
          id="export-button"
          color="primary"
          variant="contained"
          className="export-button"
          onClick={() => {
            TableExport(document.getElementById("main-table"));
            document.getElementById("export-button").classList.add("exported");
          }}
        >
          Export
        </Button>
      </div>
    </>
  );
};

export default ResultsTable;
