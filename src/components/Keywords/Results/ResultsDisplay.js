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
} from '@material-ui/core';
import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { Controller, useForm } from 'react-hook-form';
import { useKeywordsContext } from '../../../context/KeywordsContext';
import { TableExport } from 'tableexport';

const ResultsDisplay = () => {
  const { control, handleSubmit, setValue } = useForm();
  const { fulldata: data, setData, setKeyword } = useKeywordsContext();

  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);

  const descendingComparator = (a, b, orderBy) => {
    let aa = parseInt(String(a[orderBy]).replace(/\D/g, '')) || 0;
    let bb = parseInt(String(b[orderBy]).replace(/\D/g, '')) || 0;
    if (bb < aa) return -1;
    if (bb > aa) return 1;
    return 0;
  };

  const getComparator = (a, b) => {
    return order === 'desc'
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
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onSubmit = (formData) => {
    const kw = formData.keyword;
    setValue('keyword', '');
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
        <Table id='main-table'>
          <TableHead>
            <TableRow>
              <TableCell>Keyword</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'seo'}
                  direction={orderBy === 'seo' ? order : 'asc'}
                  onClick={() => handleRequestSort('seo')}
                >
                  SEO
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('ranking')}>
                <TableSortLabel
                  active={orderBy === 'ranking'}
                  direction={orderBy === 'ranking' ? order : 'asc'}
                  onClick={() => handleRequestSort('ranking')}
                >
                  Current Rank
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('volume')}>
                <TableSortLabel
                  active={orderBy === 'volume'}
                  direction={orderBy === 'volume' ? order : 'asc'}
                  onClick={() => handleRequestSort('volume')}
                >
                  Search Volume
                </TableSortLabel>
              </TableCell>
              <TableCell>4 - 6 Mths</TableCell>
              <TableCell>7 - 9 Mths</TableCell>
              <TableCell>10 - 12 Mths</TableCell>
              <TableCell>12+ Mths</TableCell>
              <TableCell>URL</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              stableSort(Object.entries(data)).map((kwdata, i) => (
                <TableRow key={kwdata.kw}>
                  <TableCell>
                    <Button
                      color='primary'
                      variant='outlined'
                      onClick={() => setKeyword(kwdata)}
                    >
                      {kwdata.kw}
                    </Button>
                  </TableCell>
                  <TableCell>{kwdata.seo || '-'}</TableCell>
                  <TableCell>{kwdata.ranking || '-'}</TableCell>
                  <TableCell>{kwdata.volume || '-'}</TableCell>
                  <TableCell>
                    {kwdata.fs &&
                    kwdata.df &&
                    kwdata.pageData.q2 &&
                    kwdata.fs * kwdata.df >= kwdata.pageData.q2
                      ? '✔'
                      : ''}
                  </TableCell>
                  <TableCell>
                    {kwdata.fs &&
                    kwdata.df &&
                    kwdata.pageData.q2 &&
                    kwdata.pageData.q3 &&
                    kwdata.fs * kwdata.df < kwdata.pageData.q2 &&
                    kwdata.fs * kwdata.df >= kwdata.pageData.q3
                      ? '✔'
                      : ''}
                  </TableCell>
                  <TableCell>
                    {kwdata.fs &&
                    kwdata.df &&
                    kwdata.pageData.q3 &&
                    kwdata.pageData.q4 &&
                    kwdata.fs * kwdata.df < kwdata.pageData.q3 &&
                    kwdata.fs * kwdata.df >= kwdata.pageData.q4
                      ? '✔'
                      : ''}
                  </TableCell>
                  <TableCell>
                    {kwdata.fs &&
                    kwdata.df &&
                    kwdata.pageData.q4 &&
                    kwdata.fs * kwdata.df < kwdata.pageData.q4
                      ? '✔'
                      : ''}
                  </TableCell>
                  <TableCell>
                    {kwdata.pageData && kwdata.pageData.url
                      ? kwdata.pageData.url
                      : ''}
                  </TableCell>
                  <TableCell style={{ maxWidth: '40px' }}>
                    <IconButton
                      aria-label='delete'
                      onClick={() => onDelete(kwdata.kw)}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <FormControl fullWidth margin='normal'>
            <Controller
              name='keyword'
              defaultValue=''
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='text'
                  fullWidth={true}
                  placeholder='i.e. seo services singapore'
                />
              )}
            />
            <FormHelperText>Add More Keywords (enter to submit)</FormHelperText>
          </FormControl>
        </form>
        <Button
          id='export-button'
          color='primary'
          variant='contained'
          className='export-button'
          onClick={() => {
            TableExport(document.getElementById('main-table'));
            document.getElementById('export-button').classList.add('exported');
          }}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
