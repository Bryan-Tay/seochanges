import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
} from "@material-ui/core";
import { useKeywords } from "../../hooks/useKeywords";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "aliceblue",
    marginBottom: "20px",
    border: "1px solid cadetblue",
    padding: "0 10px",
  },
}));

const KeywordPageOneDisplay = () => {
  const classes = useStyles();
  const { keyword, setActiveKeyword } = useKeywords();

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Keyword: {keyword.kw} </h2>
        <span
          onClick={() => setActiveKeyword(null)}
          style={{ color: "maroon", cursor: "pointer" }}
        >
          X
        </span>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>DA</TableCell>
              <TableCell>PA</TableCell>
              <TableCell>TF</TableCell>
              <TableCell>CF</TableCell>
              <TableCell>Links</TableCell>
              <TableCell>FB</TableCell>
              <TableCell>LPS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(keyword.items || []).map((item, index) => (
              <TableRow key={index} hover={true}>
                <TableCell>
                  <a
                    href={item.url}
                    rel="nofollow external noopener noreferrer"
                    target="_blank"
                  >
                    {item.url}
                  </a>
                </TableCell>
                <TableCell>{item.meta.pda || 0}</TableCell>
                <TableCell>{item.meta.upa || 0}</TableCell>
                <TableCell>{item.meta.tf || 0}</TableCell>
                <TableCell>{item.meta.cf || 0}</TableCell>
                <TableCell>{item.meta.links || 0}</TableCell>
                <TableCell>{item.meta.fb || 0}</TableCell>
                <TableCell>{item.meta.lps || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default KeywordPageOneDisplay;
