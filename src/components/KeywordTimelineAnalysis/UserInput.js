import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import { Controller, useForm } from "react-hook-form";
import countries from "../../catalogs/countries";
import { useKeywords } from "../../hooks/useKeywords";

const UserInput = () => {
  const { submitForm } = useKeywords();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      url: "https://mediaonemarketing.com.sg/",
      location: "Singapore",
      keywords: "digital marketing, marketing online, seo singapore, social media",
    },
  });

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <FormControl fullWidth margin="normal">
        <Controller
          name="url"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="url"
              label="URL"
              fullWidth={true}
              placeholder="Example https://mediaonemarketing.com.sg"
            />
          )}
        />
        <FormHelperText>
          Please include "http://" or "htts://". Example:
          https://mediaonemarketing.com.sg/
        </FormHelperText>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel required>Country</InputLabel>
        <Controller
          name="location"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select {...field}>
              {Object.entries(countries).map(([country, data]) => (
                <MenuItem key={country} value={country}>
                  <ReactCountryFlag
                    svg
                    countryCode={data.sem.toUpperCase()}
                    style={{
                      width: "1.5em",
                      height: "1.5em",
                      marginRight: "10px",
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
      <FormControl fullWidth margin="normal">
        <Controller
          name="keywords"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField // Input for Keywords
              {...field}
              required
              multiline
              fullWidth
              type="text"
              label="Keywords"
              placeholder="Example: seo services singapore"
            />
          )}
        />

        <FormHelperText>
          Separate each keyword with a comma or enter each keyword on a new
          line.
        </FormHelperText>
      </FormControl>
      <div>
        <Button type="submit" color="primary" variant="contained">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default UserInput;
