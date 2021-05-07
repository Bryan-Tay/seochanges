// After logging in, the user can access this page and fill up the form. Keywords and URLs are required for this timeline analysis.

import React, { useState } from "react";
import {
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    TextField,
    Button,
    FormHelperText,
} from "@material-ui/core"; // Material UI components.

import ReactCountryFlag from "react-country-flag";

const UserInput = ({
    setFormattedKeywords,
    setChosenLocation,
    setSubmitted,
    URL,
    setURL,
}) => {
    const [keywords, setKeywords] = useState(); // Unformatted keywords to check.
    const locations = {
        // Location data. The "sem" part is used for search volume, but we are currently out of credits.
        Singapore: { mangools: 2702, sem: "sg" },
        Malaysia: { mangools: 2458, sem: "my" },
        Australia: { mangools: 2036, sem: "au" },
        Thailand: { mangools: 2764, sem: "th" },
        Vietnam: { mangools: 2704, sem: "vn" },
        Japan: { mangools: 2392, sem: "jp" },
        SouthKorea: { mangools: 2410, sem: "kr" },
        Cambodia: { mangools: 2116, sem: "kh" },
        HongKong: { mangools: 2344, sem: "hk" },
        Taiwan: { mangools: 2158, sem: "tw" },
        Laos: { mangools: 2418, sem: "la" },
        Indonesia: { mangools: 2360, sem: "id" },
        Philippines: { mangools: 2608, sem: "ph" },
        Myanmar: { mangools: 2104, sem: "mm" },
        Brunei: { mangools: 2096, sem: "bn" },
        India: { mangools: 2356, sem: "in" },
        UnitedKingdom: { mangools: 2826, sem: "gb" },
        UnitedStates: { mangools: 2840, sem: "us" },
        Russia: { mangools: 2643, sem: "ru" },
    }; // List of location
    const [location, setLocation] = useState("Singapore"); // Selected location. Default Singapore.

    const handleSubmit = (e) => {
        // From submit control. Also sets the location based on user selected country.
        setSubmitted(true);
        switch (location) {
            case "Singapore":
                setChosenLocation(locations.Singapore);
                break;
            case "Malaysia":
                setChosenLocation(locations.Malaysia);
                break;
            case "Australia":
                setChosenLocation(locations.Australia);
                break;
            case "Thailand":
                setChosenLocation(locations.Thailand);
                break;
            case "Vietnam":
                setChosenLocation(locations.Vietnam);
                break;
            case "Japan":
                setChosenLocation(locations.Japan);
                break;
            case "SouthKorea":
                setChosenLocation(locations.SouthKorea);
                break;
            case "HongKong":
                setChosenLocation(locations.HongKong);
                break;
            case "Cambodia":
                setChosenLocation(locations.Cambodia);
                break;
            case "Laos":
                setChosenLocation(locations.Laos);
                break;
            case "Indonesia":
                setChosenLocation(locations.Indonesia);
                break;
            case "Philippines":
                setChosenLocation(locations.Philippines);
                break;
            case "Myanmar":
                setChosenLocation(locations.Myanmar);
                break;
            case "Brunei":
                setChosenLocation(locations.Brunei);
                break;
            case "India":
                setChosenLocation(locations.India);
                break;
            case "UnitedKingdom":
                setChosenLocation(locations.UnitedKingdom);
                break;
            case "UnitedStates":
                setChosenLocation(locations.UnitedStates);
                break;
            case "Russia":
                setChosenLocation(locations.Russia);
                break;
            case "Taiwan":
                setChosenLocation(locations.Taiwan);
                break;
            default:
                setChosenLocation(locations.Singapore);
        }
        setFormattedKeywords(keywords.replace(/\n/g, ",").split(",")); // Formats the keyword by removing new line \n.
        if (URL[URL.length - 1] !== "/") {
            setURL(`${URL}/`);
        }
        e.preventDefault();
    };
    return (
        <div className='userInput'>
            <form // Main form.
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
            >
                <FormControl fullWidth>
                    <TextField // Input for URL.
                        type='url'
                        margin='normal'
                        label='URL'
                        placeholder='Example: https://mediaonemarketing.com.sg/'
                        fullWidth
                        value={URL}
                        onChange={(e) => setURL(e.target.value)}
                        required
                    />
                    <FormHelperText>
                        Please include "http://" or "htts://". Example:
                        https://mediaonemarketing.com.sg/
                    </FormHelperText>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <InputLabel required>Country</InputLabel>
                    <Select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        {Object.keys(locations).map((country) => {
                            // Input for Country
                            return (
                                <MenuItem value={country} key={country}>
                                    <ReactCountryFlag
                                        countryCode={locations[
                                            country
                                        ].sem.toUpperCase()}
                                        svg
                                        style={{
                                            width: "1.5em",
                                            height: "1.5em",
                                            marginRight: "10px",
                                        }}
                                    />
                                    {country}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <FormHelperText>
                        Please run this one by one for multiple countries.
                    </FormHelperText>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField // Input for Keywords
                        type='text'
                        label='Keywords'
                        placeholder='Example: seo services singapore'
                        multiline
                        fullWidth
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        required
                    />
                    <FormHelperText>
                        Separate each keyword with a comma or enter each keyword
                        on a new line.
                    </FormHelperText>
                </FormControl>
                <div>
                    <Button type='submit' variant='contained' color='primary'>
                        {/* Submit Button */}
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserInput;
