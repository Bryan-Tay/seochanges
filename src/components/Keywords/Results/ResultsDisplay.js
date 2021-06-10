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
  TextField,
} from '@material-ui/core';
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { Controller, useForm } from 'react-hook-form';
import { useKeywordsContext } from '../../../context/KeywordsContext';
import { TableExport } from 'tableexport';

const ResultsDisplay = () => {
  const { control, handleSubmit, setValue } = useForm();
  const { fulldata: data, setData, setKeyword } = useKeywordsContext();

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
              <TableCell>Current Rank</TableCell>
              <TableCell>Search Volume</TableCell>
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
              Object.entries(data).map(([kw, kwdata], i) => (
                <TableRow key={kw}>
                  <TableCell>
                    <Button
                      color='primary'
                      variant='outlined'
                      onClick={() => setKeyword({ kw, ...kwdata })}
                    >
                      {kw}
                    </Button>
                  </TableCell>
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
                      onClick={() => onDelete(kw)}
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
