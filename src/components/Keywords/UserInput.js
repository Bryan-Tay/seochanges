import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Controller, useForm } from 'react-hook-form';
import countries from '../../catalogs/countries';
import { useKeywordsContext } from '../../context/KeywordsContext';

const UserInput = () => {
  const { control, handleSubmit } = useForm();
  const { setData, loading } = useKeywordsContext();

  const onSubmit = (formData) => {
    setData({
      url:
        formData.url[formData.url.length - 1] !== '/'
          ? formData.url + '/'
          : formData.url,
      location: formData.location,
      locationData: countries[formData.location],
      keywords: formData.keywords.replace(/\n/g, ',').split(','),
    });
  };

  return (
    <div className='userInput'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LinearProgress
          style={{
            marginTop: '1rem',
            transition: 'all 0.3s',
            opacity: loading ? 1 : 0,
          }}
        />
        <FormControl fullWidth margin='normal'>
          <Controller
            name='url'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                type='url'
                label='URL'
                fullWidth={true}
                placeholder='Example https://mediaonemarketing.com.sg'
              />
            )}
          />
          <FormHelperText>
            Please include "http://" or "htts://". Example:
            https://mediaonemarketing.com.sg/
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel required>Country</InputLabel>
          <Controller
            name='location'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Select {...field}>
                {Object.entries(countries).map(([country, data]) => (
                  <MenuItem key={country} value={country}>
                    <ReactCountryFlag
                      svg
                      countryCode={data.sem.toUpperCase()}
                      style={{
                        width: '1.5em',
                        height: '1.5em',
                        marginRight: '10px',
                      }}
                    />
                    {country}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>
            Please run this one by one for multiple countries.
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <Controller
            name='keywords'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField // Input for Keywords
                {...field}
                required
                multiline
                fullWidth
                type='text'
                label='Keywords'
                placeholder='Example: seo services singapore'
              />
            )}
          />

          <FormHelperText>
            Separate each keyword with a comma or enter each keyword on a new
            line.
          </FormHelperText>
        </FormControl>
        <div>
          <Button
            type='submit'
            color='primary'
            variant='contained'
            disabled={loading}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserInput;
