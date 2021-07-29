import _ from "lodash";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Button,
} from "@material-ui/core";
import { useKeywords } from "../../hooks/useKeywords";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "aliceblue",
    margin: "0px 1px 20px 1px",
    border: "1px solid cadetblue",
    padding: "2px 10px",
    flex: 1,
  },
}));

const RelatedKeywordTable = ({ type }) => {
  const classes = useStyles();
  const { keywords, keyword, addKeyword } = useKeywords();

  const [words, setWords] = useState([]);
  const types = ["low", "medium", "hard"];

  useEffect(() => {
    if (!keyword || !keyword.related) return;

    const related = keyword.related.slice(1).sort((a, b) => a.kd - b.kd);
    const chunks = _.chunk(related, Math.ceil(related.length / 3));

    const typeIndex = types.indexOf(String(type).toLowerCase());
    const chunk = chunks[typeIndex] || [];
    setWords(chunk);
    // eslint-disable-next-line
  }, [keyword]);

  return (
    <div className={classes.root}>
      <h2>{type} Competition</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Keyword</TableCell>
              <TableCell>Add to List</TableCell>
              <TableCell>Search Volume</TableCell>
              <TableCell>Difficulty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words && (
              <>
                {words.length > 0 ? (
                  words.map((keyword, index) => (
                    <TableRow key={index} hover={true}>
                      <TableCell>{keyword.kw}</TableCell>
                      <TableCell>
                        {keywords.includes(keyword.kw) ? (
                          <Button disabled size="small" variant="contained">
                            Added!
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => addKeyword(keyword.kw)}
                          >
                            Add
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>{keyword.search}</TableCell>
                      <TableCell>{keyword.kd}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow hover={true}>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RelatedKeywordTable;
