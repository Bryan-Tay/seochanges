import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { Controller, useForm } from "react-hook-form";
import { useKeywordsContext } from "../../../context/KeywordsContext";
import { TableExport } from "tableexport";
import SummaryCards from "./SummaryCards";

const ResultsDisplaySubheaderRow = ({ label, data }) => (
  <TableRow style={{ backgroundColor: "#ececec" }}>
    <TableCell>
      <span
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          lineHeight: "3rem",
          marginLeft: "1rem",
        }}
      >
        {label}
      </span>
    </TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell>
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: "bold",
        }}
      >
        {Object.values(data).reduce((acc, curr) => acc + (curr.search || 0), 0)}
      </span>
    </TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
  </TableRow>
);

const ResultsDisplayRow = ({ kwdata, onDelete, setKeyword }) => {
  return (
    <TableRow>
      <TableCell>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => setKeyword(kwdata)}
        >
          {kwdata.kw}
        </Button>
      </TableCell>
      <TableCell>{kwdata.kd || "-"}</TableCell>
      <TableCell>{kwdata.rank || "-"}</TableCell>
      <TableCell>{kwdata.search || "-"}</TableCell>
      <TableCell>{parseFloat(kwdata.ev).toFixed(0) || "-"}</TableCell>
      <TableCell>{parseFloat(kwdata.cpc).toFixed(2) || "-"}</TableCell>
      <TableCell>{kwdata.ppc || "-"}</TableCell>
      <TableCell>
        {kwdata.score * kwdata.df >= kwdata.qs.q2 ? "✔" : ""}
      </TableCell>
      <TableCell>
        {kwdata.score * kwdata.df < kwdata.qs.q2 &&
        kwdata.score * kwdata.df >= kwdata.qs.q3
          ? "✔"
          : ""}
      </TableCell>
      <TableCell>
        {kwdata.score * kwdata.df < kwdata.qs.q3 &&
        kwdata.score * kwdata.df >= kwdata.qs.q4
          ? "✔"
          : ""}
      </TableCell>
      <TableCell>
        {kwdata.score * kwdata.df < kwdata.qs.q4 ? "✔" : ""}
      </TableCell>
      <TableCell>{kwdata.path || ""}</TableCell>
      <TableCell style={{ maxWidth: "40px" }}>
        <IconButton aria-label="delete" onClick={() => onDelete(kwdata.kw)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const ResultsDisplay = ({ byDifficulty }) => {
  const { control, handleSubmit, setValue } = useForm();
  const { fulldata: data, setData, setKeyword } = useKeywordsContext();

  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);

  const [lowData, setLowData] = useState({});
  const [mediumData, setMediumData] = useState({});
  const [highData, setHighData] = useState({});
  const [othersData, setOthersData] = useState({});
  useEffect(() => {
    let low = {};
    let medium = {};
    let high = {};
    let others = {};
    for (let [kw, kwdata] of Object.entries(data)) {
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
  }, [data]);

  const descendingComparator = (a, b, orderBy) => {
    let aa = parseInt(String(a[orderBy]).replace(/\D/g, "")) || 0;
    let bb = parseInt(String(b[orderBy]).replace(/\D/g, "")) || 0;
    if (bb < aa) return -1;
    if (bb > aa) return 1;
    return 0;
  };

  const getComparator = (a, b) => {
    return order === "desc"
      ? descendingComparator(a, b, orderBy)
      : -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array) => {
    const stable = array.reduce(
      (acc, curr) => [...acc, { kw: curr[0], ...curr[1] }],
      []
    );
    const stabilizedThis = stable.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = getComparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onSubmit = (formData) => {
    const kw = String(formData.keyword).toLowerCase().trim();
    setValue("keyword", "");
    setData((current) => {
      if (current.keywords.indexOf(kw) > -1) return current;
      return {
        ...current,
        keywords: [...current.keywords, kw],
      };
    });
  };

  const onDelete = (keyword) => {
    setKeyword(null);
    setData((current) => ({
      ...current,
      keywords: current.keywords.filter((kw) => kw !== keyword),
    }));
  };

  return (
    <div>
      <TableContainer>
        <Table id="main-table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Keyword</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "kd"}
                  direction={orderBy === "kd" ? order : "asc"}
                  onClick={() => handleRequestSort("kd")}
                >
                  Magic Score
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort("rank")}>
                <TableSortLabel
                  active={orderBy === "rank"}
                  direction={orderBy === "rank" ? order : "asc"}
                  onClick={() => handleRequestSort("rank")}
                >
                  Current Rank
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort("search")}>
                <TableSortLabel
                  active={orderBy === "search"}
                  direction={orderBy === "search" ? order : "asc"}
                  onClick={() => handleRequestSort("search")}
                >
                  Search Volume
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort("ev")}>
                <Tooltip title="Estimated Visits Per Month (last 12 months)">
                  <TableSortLabel
                    active={orderBy === "ev"}
                    direction={orderBy === "ev" ? order : "asc"}
                    onClick={() => handleRequestSort("ev")}
                  >
                    EV
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => handleRequestSort("cpc")}>
                <Tooltip title="Average Cost Per Click">
                  <TableSortLabel
                    active={orderBy === "cpc"}
                    direction={orderBy === "cpc" ? order : "asc"}
                    onClick={() => handleRequestSort("cpc")}
                  >
                    CPC
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => handleRequestSort("ppc")}>
                <Tooltip title="Pay Per Click">
                  <TableSortLabel
                    active={orderBy === "ppc"}
                    direction={orderBy === "ppc" ? order : "asc"}
                    onClick={() => handleRequestSort("ppc")}
                  >
                    PPC
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>4 - 6 Mths</TableCell>
              <TableCell>7 - 9 Mths</TableCell>
              <TableCell>10 - 12 Mths</TableCell>
              <TableCell>12+ Mths</TableCell>
              <TableCell>URL</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {data && (
            <TableBody>
              {!byDifficulty ? (
                stableSort(
                  Object.entries({
                    ...lowData,
                    ...mediumData,
                    ...highData,
                    ...othersData,
                  })
                ).map((kwdata, i) => (
                  <ResultsDisplayRow
                    key={kwdata.kw}
                    kwdata={kwdata}
                    onDelete={onDelete}
                    setKeyword={setKeyword}
                  />
                ))
              ) : (
                <>
                  {Object.keys(lowData).length > 0 && (
                    <>
                      <ResultsDisplaySubheaderRow label="Low" data={lowData} />
                      {stableSort(Object.entries(lowData)).map((kwdata, i) => (
                        <ResultsDisplayRow
                          key={kwdata.kw}
                          kwdata={kwdata}
                          onDelete={onDelete}
                          setKeyword={setKeyword}
                        />
                      ))}
                    </>
                  )}
                  {Object.keys(mediumData).length > 0 && (
                    <>
                      <ResultsDisplaySubheaderRow
                        label="Medium"
                        data={mediumData}
                      />
                      {stableSort(Object.entries(mediumData)).map(
                        (kwdata, i) => (
                          <ResultsDisplayRow
                            key={kwdata.kw}
                            kwdata={kwdata}
                            onDelete={onDelete}
                            setKeyword={setKeyword}
                          />
                        )
                      )}
                    </>
                  )}
                  {Object.keys(highData).length > 0 && (
                    <>
                      <ResultsDisplaySubheaderRow
                        label="High"
                        data={highData}
                      />
                      {stableSort(Object.entries(highData)).map((kwdata, i) => (
                        <ResultsDisplayRow
                          key={kwdata.kw}
                          kwdata={kwdata}
                          onDelete={onDelete}
                          setKeyword={setKeyword}
                        />
                      ))}
                    </>
                  )}
                  {Object.keys(othersData).length > 0 && (
                    <>
                      <ResultsDisplaySubheaderRow
                        label="Others"
                        data={othersData}
                      />
                      {stableSort(Object.entries(othersData)).map(
                        (kwdata, i) => (
                          <ResultsDisplayRow
                            key={kwdata.kw}
                            kwdata={kwdata}
                            onDelete={onDelete}
                            setKeyword={setKeyword}
                          />
                        )
                      )}
                    </>
                  )}
                </>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormControl fullWidth margin="normal">
            <Controller
              name="keyword"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth={true}
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
    </div>
  );
};

export default ResultsDisplay;
