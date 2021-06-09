import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Button,
} from '@material-ui/core';
import { useKeywordsContext } from '../../../context/KeywordsContext';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'aliceblue',
    margin: '0px 1px 20px 1px',
    border: '1px solid cadetblue',
    padding: '2px 10px',
    flex: 1,
  },
}));

const RelatedKeywordTable = ({ type }) => {
  const classes = useStyles();
  const { keywords, keyword, setData } = useKeywordsContext();

  const types = ['low', 'medium', 'hard'];
  const [words, setWords] = useState([]);
  const [sort, setSort] = useState('asc');

  const sortFn = (a, b) => (sort === 'asc' ? b.sv - a.sv : a.sv - b.sv);

  useEffect(() => {
    if (!keyword || !keyword.related) return;

    const related = keyword.related.slice(1).sort((a, b) => a.seo - b.seo);
    const chunks = _.chunk(related, Math.ceil(related.length / 3));

    const typeIndex = types.indexOf(String(type).toLowerCase());
    const chunk = chunks[typeIndex] || [];
    setWords(chunk);
  }, [keyword]);

  const onAdd = (kw) => {
    setData((current) => {
      if (current.keywords.indexOf(kw) > -1) return current;
      return {
        ...current,
        keywords: [...current.keywords, kw],
      };
    });
  };

  return (
    <div className={classes.root}>
      <h2>{type} Competition</h2>
      <Button
        color='primary'
        onClick={() => setSort((s) => (s === 'asc' ? 'desc' : 'asc'))}
      >
        Toogle Sort
      </Button>
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
            {words &&
              words.sort(sortFn).map((keyword, index) => (
                <TableRow key={index} hover={true}>
                  <TableCell>{keyword.kw}</TableCell>
                  <TableCell>
                    {keywords.includes(keyword.kw) ? (
                      <Button disabled variant='contained'>
                        Added!
                      </Button>
                    ) : (
                      <Button
                        color='primary'
                        variant='outlined'
                        onClick={() => onAdd(keyword.kw)}
                      >
                        Add
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{keyword.sv}</TableCell>
                  <TableCell>{keyword.seo}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RelatedKeywordTable;