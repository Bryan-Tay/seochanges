// After main form submission from UserInput.js, this component will render.

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ResultsDisplay from "./Results/ResultsDisplay";
import Coefficients from "./Coefficients"; // Allows changing of coefficients
import KeywordPageOneDisplay from "./Results/KeywordPageOneDisplay"; // Allows showing the KeywordPageOneDisplay Component after everything is rendered on this page.
import CustomPrompt from "./Misc/CustomPrompt"; // Custom prompt when user tries to leave (in case they close the tab by accident).
import ClipLoader from "react-spinners/ClipLoader"; // Loading icon
import RelatedKeywordTable from "./Results/RelatedKeywordTable";

let KEY = process.env.REACT_APP_KEY; // SECRET KEY from .env (note: MUST start with REACT_APP_)

const MainFunction = ({ url, keywords, location }) => {
    const usePrevious = (arr) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = arr;
        });
        return ref.current;
    };

    // Main consolidation
    let page = {}; // Not const because this is not a hook. We reset this everything the user resubmits the form.

    // Coefficients // Currently disabled
    const [DA, setDA] = useState(0.5);
    const [PA, setPA] = useState(0.3);
    const [CF, setCF] = useState(0.05);
    const [TF, setTF] = useState(0.05);
    const [LINKS, setLINKS] = useState(0.05);
    const [FB, setFB] = useState(0.02);
    const [LPS, setLPS] = useState(0.03);

    // Client's Details
    const [FS, setFS] = useState([]); // Final Score (FS) is the ultimate score we are comparing with.
    const [allUrls, setAllUrls] = useState([]); // All the URLS from the API call to Mangools.

    // Search Volume
    const [volume, setVolume] = useState([]); //

    // Page results
    const [allQ2, setAllQ2] = useState([]); // 2nd Quarter (Q2): for comparison. results based on results ranked 6 to 10 (if available).
    const [allQ3, setAllQ3] = useState([]); // 3rd Quarter (Q3): for comparison. results based on results ranked 11 to 15 (if available).
    const [allQ4, setAllQ4] = useState([]); // 4th Quarter (Q4): for comparison. results based on results ranked 16 to 20 (if available).

    // Current Ranking
    const [currentRanking, setCurrentRanking] = useState([]); // Current ranking for all the keywords stored in an array.

    // Distance Factoring
    const [DF, setDF] = useState([]);

    // Individual Keywords Component
    const [show, setShow] = useState(false); // To render KeywordPageOneDisplay.js onClick of keyword.
    const [data, setData] = useState([]); // Props for KeywordPageOneDisplay.js
    const [displayKeyword, setDisplayKeyword] = useState(); // Single Keyword to display.
    const [displayData, setDisplayData] = useState(); // Page 1 data of displayKeyword.

    // Miscellaneous
    const [credit, setCredit] = useState(0); // Keeps track of how many credits being used per search. Will be displayed at the top of the page.
    const [load, setLoad] = useState(false); // Displays the loading icon when the functions are running.
    const [errorMessage, setErrorMessage] = useState(null); // Displays any error message. Note that Error 429 means that we are out of credits.
    const [loadMessage, setLoadMessage] = useState(""); // Displays the loading message when the functions are running.

    // Related Keywords
    const [relatedKeywords, setRelatedKeywords] = useState([]);
    const [extraRelatedKeywords, setExtraRelatedKeywords] = useState([]);
    const [displayRelatedKeywords, setDisplayRelatedKeywords] = useState([]);
    //
    const [extraKW, setExtraKW] = useState([]);
    const prevKeywords = usePrevious(extraRelatedKeywords);

    // Function to check Final Score

    const getFS = (da, pa, cf, tf, links, fb, lps, emd) => {
        // Basically, the score from Mangools multiplied by the coefficients we set above.
        let fs =
            (da * DA +
                pa * PA +
                cf * CF +
                tf * TF +
                links * LINKS +
                fb * FB +
                lps * LPS) *
            emd;
        return fs;
    };

    const checkEMD = (keyword, tempURL) => {
        // Function to get whether a domain is EMD or not
        let hostname = new URL(tempURL).hostname;
        if (hostname.includes("www.")) {
            hostname = hostname.slice(4);
        }
        let match = hostname.substr(0, hostname.indexOf("."));
        keyword = keyword.replace(/\s+/g, "");
        if (match.includes(keyword) || keyword.includes(match)) {
            return 1.5;
        } else {
            return 0.5;
        }
    };

    // Debug
    /******************************** UseEffect: Fetch data on submit (from UserInput.js) ********************************/
    useEffect(() => {
        // Getting Search Volume + Related Keywords (svrk)
        const getSvrk = async () => {
            try {
                for (let i = 0; i < keywords.length; i++) {
                    let svrkResponse = await axios({
                        // Calling the Mangools API to get the search volume for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/related-keywords/?kw=${keywords[i]}&location_id=${location.mangools}`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });
                    setVolume((volume) => [
                        ...volume,
                        svrkResponse.data.keywords[0].sv,
                    ]);
                    let tempKW = svrkResponse.data.keywords
                        .filter((elem) => elem.seo)
                        .slice(0, 10);// lets try 10 instead of 100

                    setRelatedKeywords((relatedKeywords) => [
                        ...relatedKeywords,
                        tempKW,
                    ]);
                }
            } catch (error) {
                setErrorMessage(error.message);
                console.log(error.message);
            }
        };

        // Getting most relevant page of submitted data per keyword
        const fetchClient = async () => {
            try {
                for (let i = 0; i < keywords.length; i++) {
                    // For each keyword
                    setCredit((credit) => credit + 1);
                    page[keywords[i]] = {
                        // Initialises an object in the "page" object.
                        lps: 0,
                        url: "",
                        q2: 0,
                        q3: 0,
                        q4: 0,
                        values: [],
                    };

                    let response = await axios({
                        // Calling the Mangools API to get the most relevant page for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${url}%20${keywords[i]}&location_id=${location.mangools}`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });

                    // Setting URLs and LPS per keyword submitted

                    page[keywords[i]].url = response.data[0].items[0].url;
                    setAllUrls((allUrls) => [
                        // Setting the URL for each keyword in the allUrls state.
                        ...allUrls,
                        response.data[0].items[0].url.slice(url.length - 1),
                    ]);

                    setFS((FS) => [
                        // Getting the FS for each keyword and storing it in the "FS" state.
                        ...FS,
                        getFS(
                            // Calls the getFS function and passes in the parameters based on results.
                            response.data[0].items[0].m.moz.v.pda || 0,
                            response.data[0].items[0].m.moz.v.upa || 0,
                            response.data[0].items[0].m.majestic.v
                                .CitationFlow || 0,
                            response.data[0].items[0].m.majestic.v.TrustFlow ||
                                0,
                            response.data[0].items[0].m.majestic.v
                                .ExtBackLinks || 0,
                            response.data[0].items[0].m.fb.v.l || 0,
                            response.data[0].items[0].m.rank.v.r || 0,
                            checkEMD(keywords[i], url)
                        ),
                    ]);
                }
            } catch (error) {
                console.log(error);
                setErrorMessage(error.message);
            }
        };

        /******************************** Getting Page 1 Info per keyword ********************************/
        const fetchData = async () => {
            try {
                for (let i = 0; i < keywords.length; i++) {
                    // Getting results for all keywords entered.
                    setCredit((credit) => credit + 1);
                    setLoadMessage("Fetching Page 1");
                    let res = await axios({
                        // Fetching page 1 results for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${keywords[i]}&location_id=${location.mangools}`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });
                    setLoadMessage("Fetching Page 2");
                    setCredit((credit) => credit + 1);
                    let res2 = await axios({
                        // Fetching page 2 results for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${keywords[i]}&location_id=${location.mangools}&page=1`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });

                    setData((data) => [...data, res.data]); // Storing data as an object into the "data" state. Props for KeywordPageOneDisplay component.

                    let exit = false;
                    while (true) {
                        setLoadMessage(`checking page 1`); // Settig load message.
                        for (let j = 0; j < res.data[0].items.length; j++) {
                            // Checking if the client appears on page 1.
                            if (url.includes(res.data[0].items[j].domain)) {
                                // If found, set the Distance Factor (DF) to 100 and stores in the DF array.
                                setLoadMessage(`FOUND ON PAGE 1`);
                                setDF((DF) => [...DF, 100]);
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 1, // j + 1 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }

                        setLoadMessage(`checking page 2`); // Settig load message.
                        for (let j = 0; j < res2.data[0].items.length; j++) {
                            // Checking if the client appears on page 2.
                            if (url.includes(res2.data[0].items[j].domain)) {
                                // If found, set the Distance Factor (DF) to 1.8 and stores in the DF array.

                                setDF((DF) => [...DF, 1.8]);
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 11, // j + 11 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }

                        setLoadMessage("Fetching Page 3");
                        setCredit((credit) => credit + 1);
                        let res3 = await axios({
                            // Fetching page 3 results for keywords[i] if the client is not found on page 1 or 2.
                            method: "get",
                            url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${keywords[i]}&location_id=${location.mangools}&page=2`,
                            headers: {
                                "x-access-token": KEY,
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":
                                    "Content-Type, Authorization",
                            },
                        });

                        setLoadMessage(`checking page 3`);
                        for (let j = 0; j < res3.data[0].items.length; j++) {
                            // Checking if the client appears on page 3.
                            if (url.includes(res3.data[0].items[j].domain)) {
                                setDF((DF) => [...DF, 1.4]); // If found, set the Distance Factor (DF) to 1.4 and stores in the DF array.
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 21, // i + 21 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }

                        setCredit((credit) => credit + 1);
                        setLoadMessage("Fetching Page 4");
                        let res4 = await axios({
                            // Fetching page 3 results for keywords[i] if the client is not found on page 1, 2, or 3.
                            method: "get",
                            url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${keywords[i]}&location_id=${location.mangools}&page=3`,
                            headers: {
                                "x-access-token": KEY,
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":
                                    "Content-Type, Authorization",
                            },
                        });

                        setLoadMessage(`checking page 4`);
                        for (let j = 0; j < res4.data[0].items.length; j++) {
                            // Checking if the client appears on page 4.
                            if (url.includes(res4.data[0].items[j].domain)) {
                                setDF((DF) => [...DF, 1.2]); // If found, set the Distance Factor (DF) to 1.2 and stores in the DF array.
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 31, // i + 31 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }
                        setCredit((credit) => credit + 1);
                        setLoadMessage("Fetching Page 5");
                        let res5 = await axios({
                            // Fetching page 3 results for keywords[i] if the client is not found on page 1, 2, 3, or 4.
                            method: "get",
                            url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${keywords[i]}&location_id=${location.mangools}&page=4`,
                            headers: {
                                "x-access-token": KEY,
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":
                                    "Content-Type, Authorization",
                            },
                        });

                        setLoadMessage(`checking page 5`);
                        for (let j = 0; j < res5.data[0].items.length; j++) {
                            // Checking if the client appears on page 5.
                            if (url.includes(res5.data[0].items[j].domain)) {
                                setDF((DF) => [...DF, 1.1]); // If found, set the Distance Factor (DF) to 1.2 and stores in the DF array.
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 41, // i + 41 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }

                        setDF((DF) => [...DF, 1]); // If not found on top 5, set distance factor (DF) to 1.
                        setCurrentRanking((currentRanking) => [
                            ...currentRanking,
                            "50+",
                        ]);
                        break; // Breaks out of outer while loop.
                    }
                    setLoadMessage("all data fetched");
                    /******************************** END Getting Page 1 Info per keyword ********************************/

                    /**************************** Getting FS for each competitor of Page 1 & 2 ***************************/

                    for (let j = 0; j < res.data[0].items.length; j++) {
                        // For each item on page 1:
                        page[keywords[i]].values.push(
                            // get the FS of page 1 via the getFS function and push the returned result to the page.[keyword].values for calculation later.
                            getFS(
                                res.data[0].items[j].m.moz.v.pda || 0,
                                res.data[0].items[j].m.moz.v.upa || 0,
                                res.data[0].items[j].m.majestic.v
                                    .CitationFlow || 0,
                                res.data[0].items[j].m.majestic.v.TrustFlow ||
                                    0,
                                res.data[0].items[j].m.majestic.v
                                    .ExtBackLinks || 0,
                                res.data[0].items[j].m.fb
                                    ? res.data[0].items[j].m.fb.v.l || 0
                                    : 0,
                                res.data[0].items[j].m.rank.v.r || 0,
                                checkEMD(
                                    keywords[i],
                                    "https://mbg.com.sg:8081/https://" +
                                        res.data[0].items[j].domain +
                                        "/"
                                )
                            )
                        );
                    }

                    for (let b = 0; b < res2.data[0].items.length; b++) {
                        // For each item on page 2:
                        page[keywords[i]].values.push(
                            // get the FS of page 2 via the getFS function and push the returned result to the page.[keyword].values for calculation later.
                            getFS(
                                res2.data[0].items[b].m.moz.v.pda || 0,
                                res2.data[0].items[b].m.moz.v.upa || 0,
                                res2.data[0].items[b].m.majestic.v
                                    .CitationFlow || 0,
                                res2.data[0].items[b].m.majestic.v.TrustFlow ||
                                    0,
                                res2.data[0].items[b].m.majestic.v
                                    .ExtBackLinks || 0,
                                res2.data[0].items[b].m.fb
                                    ? res2.data[0].items[b].m.fb.v.l || 0
                                    : 0,
                                res2.data[0].items[b].m.rank.v.r || 0,
                                checkEMD(
                                    keywords[i],
                                    "https://mbg.com.sg:8081/https://" +
                                        res2.data[0].items[b].domain +
                                        "/"
                                )
                            )
                        );
                    }

                    page[keywords[i]].values.sort((a, b) => b - a); // Sorts the results based on the top 20 (or lesser) so that we can get the Q1, Q2, and Q3 for comparison.
                    page[keywords[i]].q2 = // Getting Q2 results based on results 6, 7, 8, 9, 10.
                        (page[keywords[i]].values[5] +
                            page[keywords[i]].values[6] +
                            page[keywords[i]].values[7] +
                            page[keywords[i]].values[8] +
                            page[keywords[i]].values[9]) /
                        5;

                    setAllQ2((allQ2) => [...allQ2, page[keywords[i]].q2]); // Setting Q2 results in the state.

                    page[keywords[i]].q3 = // Getting Q3 results based on results 11, 12, 13, 14, 15.
                        (page[keywords[i]].values[10] +
                            page[keywords[i]].values[11] +
                            page[keywords[i]].values[12] +
                            page[keywords[i]].values[13] +
                            page[keywords[i]].values[14]) /
                        5;
                    setAllQ3((allQ3) => [...allQ3, page[keywords[i]].q3]); // Setting Q3 results in the state.

                    let temp = page[keywords[i]].values.slice(14);
                    page[keywords[i]].q4 = // Getting Q3 results based on results 16 onwards. We don't check until 20 because sometimes there might be only 7-9 results on page 1 of Google.
                        temp.reduce((a, b) => a + b) / temp.length; // Getting the average.
                    setAllQ4((allQ4) => [...allQ4, page[keywords[i]].q4]); // Setting Q4 results in the state.
                }
                /**************************** END Getting FS for each competitor of Page 1 & 2 ***************************/
                setLoad(true);
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.message);
            }
        };
        fetchClient();
        getSvrk();
        fetchData();
    }, [keywords]); // Rerenders if keywords are changed. i.e. when user resubmits the main form.
    /******************************** END UseEffect: Fetch data on submit (from UserInput.js) ********************************/

    /******************************** UseEffect: Fetch data for new Keywords (from RelatedKeywordTable.js) ********************************/
    useEffect(() => {
        if (
            extraRelatedKeywords !== prevKeywords &&
            extraRelatedKeywords.length
        ) {
            setLoadMessage("Checking new keyword...");
            setExtraKW((extraKW) => [...extraKW, extraRelatedKeywords]);
            setLoad(false);
            const getSvrk = async () => {
                try {
                    let svrkResponse = await axios({
                        // Calling the Mangools API to get the search volume for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/related-keywords/?kw=${extraRelatedKeywords}&location_id=${location.mangools}`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });
                    setVolume((volume) => [
                        ...volume,
                        svrkResponse.data.keywords[0].sv,
                    ]);
                    let tempKW = svrkResponse.data.keywords.slice(0, 50);
                    setRelatedKeywords((relatedKeywords) => [
                        ...relatedKeywords,
                        tempKW,
                    ]);
                } catch (error) {
                    setErrorMessage(error.message);
                    console.log(error.message);
                }
            };
            const fetchClient = async () => {
                try {
                    setCredit((credit) => credit + 1);

                    page[extraRelatedKeywords] = {
                        lps: 0,
                        url: "",
                        q2: 0,
                        q3: 0,
                        q4: 0,
                        values: [],
                    };
                    let response = await axios({
                        // Calling the Mangools API to get the most relevant page for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${url}%20${extraRelatedKeywords}&location_id=${location.mangools}`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });

                    // Setting URLs and LPS per keyword submitted

                    page[extraRelatedKeywords].url =
                        response.data[0].items[0].url;
                    setAllUrls((allUrls) => [
                        // Setting the URL for each keyword in the allUrls state.
                        ...allUrls,
                        response.data[0].items[0].url.slice(url.length - 1),
                    ]);

                    setFS((FS) => [
                        // Getting the FS for each keyword and storing it in the "FS" state.
                        ...FS,
                        getFS(
                            // Calls the getFS function and passes in the parameters based on results.
                            response.data[0].items[0].m.moz.v.pda || 0,
                            response.data[0].items[0].m.moz.v.upa || 0,
                            response.data[0].items[0].m.majestic.v
                                .CitationFlow || 0,
                            response.data[0].items[0].m.majestic.v.TrustFlow ||
                                0,
                            response.data[0].items[0].m.majestic.v
                                .ExtBackLinks || 0,
                            response.data[0].items[0].m.fb.v.l || 0,
                            response.data[0].items[0].m.rank.v.r || 0,
                            checkEMD(extraRelatedKeywords, url)
                        ),
                    ]);
                } catch (error) {
                    console.log(error);
                    setErrorMessage(error.message);
                }
            };

            /******************************** Getting Page 1 Info per keyword ********************************/
            const fetchData = async () => {
                try {
                    setCredit((credit) => credit + 1);

                    let res = await axios({
                        // Fetching page 1 results for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${extraRelatedKeywords}&location_id=${location.mangools}`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });
                    setCredit((credit) => credit + 1);
                    let res2 = await axios({
                        // Fetching page 2 results for keywords[i].
                        method: "get",
                        url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${extraRelatedKeywords}&location_id=${location.mangools}&page=1`,
                        headers: {
                            "x-access-token": KEY,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization",
                        },
                    });

                    setData((data) => [...data, res.data]); // Storing data as an object into the "data" state. Props for KeywordPageOneDisplay component.

                    let exit = false;
                    while (true) {
                        setLoadMessage(`checking page 1`); // Settig load message.
                        for (let j = 0; j < res.data[0].items.length; j++) {
                            // Checking if the client appears on page 1.
                            if (url.includes(res.data[0].items[j].domain)) {
                                // If found, set the Distance Factor (DF) to 100 and stores in the DF array.
                                setDF((DF) => [...DF, 100]);
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 1, // j + 1 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }

                        setLoadMessage(`checking page 2`); // Settig load message.
                        for (let j = 0; j < res2.data[0].items.length; j++) {
                            // Checking if the client appears on page 2.
                            if (url.includes(res2.data[0].items[j].domain)) {
                                // If found, set the Distance Factor (DF) to 1.8 and stores in the DF array.
                                setDF((DF) => [...DF, 1.8]);
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 11, // j + 11 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }
                        setCredit((credit) => credit + 1);

                        let res3 = await axios({
                            // Fetching page 3 results for keywords[i] if the client is not found on page 1 or 2.
                            method: "get",
                            url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${extraRelatedKeywords}&location_id=${location.mangools}&page=2`,
                            headers: {
                                "x-access-token": KEY,
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":
                                    "Content-Type, Authorization",
                            },
                        });

                        for (let j = 0; j < res3.data[0].items.length; j++) {
                            // Checking if the client appears on page 3.
                            if (url.includes(res3.data[0].items[j].domain)) {
                                setDF((DF) => [...DF, 1.4]); // If found, set the Distance Factor (DF) to 1.4 and stores in the DF array.
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 21, // i + 21 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }

                        setCredit((credit) => credit + 1);
                        let res4 = await axios({
                            // Fetching page 3 results for extraRelatedKeywords if the client is not found on page 1, 2, or 3.
                            method: "get",
                            url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${extraRelatedKeywords}&location_id=${location.mangools}&page=3`,
                            headers: {
                                "x-access-token": KEY,
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":
                                    "Content-Type, Authorization",
                            },
                        });

                        for (let j = 0; j < res4.data[0].items.length; j++) {
                            // Checking if the client appears on page 4.
                            if (url.includes(res4.data[0].items[j].domain)) {
                                setDF((DF) => [...DF, 1.2]); // If found, set the Distance Factor (DF) to 1.2 and stores in the DF array.
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 31, // i + 31 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }
                        setCredit((credit) => credit + 1);

                        let res5 = await axios({
                            // Fetching page 3 results for extraRelatedKeywords if the client is not found on page 1, 2, 3, or 4.
                            method: "get",
                            url: `https://mbg.com.sg:8081/https://api.mangools.com/v2/kwfinder/serps/?kw=${extraRelatedKeywords}&location_id=${location.mangools}&page=4`,
                            headers: {
                                "x-access-token": KEY,
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":
                                    "Content-Type, Authorization",
                            },
                        });

                        for (let j = 0; j < res5.data[0].items.length; j++) {
                            // Checking if the client appears on page 5.
                            if (url.includes(res5.data[0].items[j].domain)) {
                                setDF((DF) => [...DF, 1.1]); // If found, set the Distance Factor (DF) to 1.2 and stores in the DF array.
                                setCurrentRanking((currentRanking) => [
                                    ...currentRanking,
                                    j + 41, // i + 41 will be their position on Google.
                                ]);
                                exit = true;
                                break; // Breaks out of inner for loop.
                            }
                        }
                        if (exit) {
                            break; // Breaks out of outer while loop.
                        }

                        setDF((DF) => [...DF, 1]); // If not found on top 5, set distance factor (DF) to 1.
                        setCurrentRanking((currentRanking) => [
                            ...currentRanking,
                            "50+",
                        ]);
                        break; // Breaks out of outer while loop.
                    }
                    /******************************** END Getting Page 1 Info per keyword ********************************/

                    /**************************** Getting FS for each competitor of Page 1 & 2 ***************************/

                    for (let j = 0; j < res.data[0].items.length; j++) {
                        // For each item on page 1:
                        page[extraRelatedKeywords].values.push(
                            // get the FS of page 1 via the getFS function and push the returned result to the page.[keyword].values for calculation later.
                            getFS(
                                res.data[0].items[j].m.moz.v.pda || 0,
                                res.data[0].items[j].m.moz.v.upa || 0,
                                res.data[0].items[j].m.majestic.v
                                    .CitationFlow || 0,
                                res.data[0].items[j].m.majestic.v.TrustFlow ||
                                    0,
                                res.data[0].items[j].m.majestic.v
                                    .ExtBackLinks || 0,
                                res.data[0].items[j].m.fb
                                    ? res.data[0].items[j].m.fb.v.l || 0
                                    : 0,
                                res.data[0].items[j].m.rank.v.r || 0,
                                checkEMD(
                                    extraRelatedKeywords,
                                    "https://mbg.com.sg:8081/https://" +
                                        res.data[0].items[j].domain +
                                        "/"
                                )
                            )
                        );
                    }

                    for (let b = 0; b < res2.data[0].items.length; b++) {
                        // For each item on page 2:
                        page[extraRelatedKeywords].values.push(
                            // get the FS of page 2 via the getFS function and push the returned result to the page.[keyword].values for calculation later.
                            getFS(
                                res2.data[0].items[b].m.moz.v.pda || 0,
                                res2.data[0].items[b].m.moz.v.upa || 0,
                                res2.data[0].items[b].m.majestic.v
                                    .CitationFlow || 0,
                                res2.data[0].items[b].m.majestic.v.TrustFlow ||
                                    0,
                                res2.data[0].items[b].m.majestic.v
                                    .ExtBackLinks || 0,
                                res2.data[0].items[b].m.fb
                                    ? res2.data[0].items[b].m.fb.v.l || 0
                                    : 0,
                                res2.data[0].items[b].m.rank.v.r || 0,
                                checkEMD(
                                    extraRelatedKeywords,
                                    "https://mbg.com.sg:8081/https://" +
                                        res2.data[0].items[b].domain +
                                        "/"
                                )
                            )
                        );
                    }

                    page[extraRelatedKeywords].values.sort((a, b) => b - a); // Sorts the results based on the top 20 (or lesser) so that we can get the Q1, Q2, and Q3 for comparison.
                    page[extraRelatedKeywords].q2 = // Getting Q2 results based on results 6, 7, 8, 9, 10.
                        (page[extraRelatedKeywords].values[5] +
                            page[extraRelatedKeywords].values[6] +
                            page[extraRelatedKeywords].values[7] +
                            page[extraRelatedKeywords].values[8] +
                            page[extraRelatedKeywords].values[9]) /
                        5;

                    setAllQ2((allQ2) => [
                        ...allQ2,
                        page[extraRelatedKeywords].q2,
                    ]); // Setting Q2 results in the state.

                    page[extraRelatedKeywords].q3 = // Getting Q3 results based on results 11, 12, 13, 14, 15.
                        (page[extraRelatedKeywords].values[10] +
                            page[extraRelatedKeywords].values[11] +
                            page[extraRelatedKeywords].values[12] +
                            page[extraRelatedKeywords].values[13] +
                            page[extraRelatedKeywords].values[14]) /
                        5;
                    setAllQ3((allQ3) => [
                        ...allQ3,
                        page[extraRelatedKeywords].q3,
                    ]); // Setting Q3 results in the state.

                    let temp = page[extraRelatedKeywords].values.slice(14);
                    page[extraRelatedKeywords].q4 = // Getting Q3 results based on results 16 onwards. We don't check until 20 because sometimes there might be only 7-9 results on page 1 of Google.
                        temp.reduce((a, b) => a + b) / temp.length; // Getting the average.
                    setAllQ4((allQ4) => [
                        ...allQ4,
                        page[extraRelatedKeywords].q4,
                    ]); // Setting Q4 results in the state.

                    /**************************** END Getting FS for each competitor of Page 1 & 2 ***************************/
                } catch (error) {
                    console.log(error.message);
                    setErrorMessage(error.message);
                } finally {
                    setLoad(true);
                }
            };
            fetchClient();
            getSvrk();
            fetchData();
        }
    });
    /******************************** END UseEffect: Fetch data on submit (from RelatedKeywordTable.js) ********************************/

    const handleShow = (index) => {
        // handleShow for the KeywordPageOneDisplay component.
        setShow(true);
        setDisplayKeyword(keywords[index]);
        setDisplayData(data[index]);
        setDisplayRelatedKeywords(relatedKeywords[index]);
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <CustomPrompt />
            <h2>
                Checking {url} in {location.sem.toUpperCase()}.
            </h2>
            <p>Credits used for this search: {credit}</p>
            {/** Displays the credit used for each search. **/}
            {load ? (
                ""
            ) : (
                <div>
                    <ClipLoader size={10} color={"#123abc"} />
                    {/** Displays the loading icon when the functions are running **/}
                    <p>{loadMessage}</p>
                </div>
            )}
            <ResultsDisplay // Once all the data is fetched, it will be displayed in this component.
                keywords={keywords}
                load={load}
                handleShow={handleShow}
                currentRanking={currentRanking}
                volume={volume}
                FS={FS}
                DF={DF}
                allQ2={allQ2}
                allQ3={allQ3}
                allQ4={allQ4}
                allUrls={allUrls}
                extraKW={extraKW}
                setExtraRelatedKeywords={setExtraRelatedKeywords}
            />
            {errorMessage ? (
                <p style={{ color: "red" }}>
                    An error has occured: {errorMessage}
                </p>
            ) : (
                ""
            )}
            {show ? (
                <div>
                    <KeywordPageOneDisplay
                        keyword={displayKeyword}
                        data={displayData}
                        setShow={setShow}
                    />
                    <div style={{ display: "flex" }}>
                        <RelatedKeywordTable
                            displayRelatedKeywords={displayRelatedKeywords}
                            setExtraRelatedKeywords={setExtraRelatedKeywords}
                            load={load}
                            keywords={keywords}
                            extraRelatedKeywords={extraRelatedKeywords}
                            text={"Low"}
                        />
                        <RelatedKeywordTable
                            displayRelatedKeywords={displayRelatedKeywords}
                            setExtraRelatedKeywords={setExtraRelatedKeywords}
                            load={load}
                            keywords={keywords}
                            extraRelatedKeywords={extraRelatedKeywords}
                            text={"Medium"}
                        />
                        <RelatedKeywordTable
                            displayRelatedKeywords={displayRelatedKeywords}
                            setExtraRelatedKeywords={setExtraRelatedKeywords}
                            load={load}
                            keywords={keywords}
                            extraRelatedKeywords={extraRelatedKeywords}
                            text={"Hard"}
                        />
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default MainFunction;
