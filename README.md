# MediaOne's Keyword Magic App

- Flow: Login > UserInput > MainFunction > ResultsDisplay
- Optional: Coefficients renders with ResultsDisplay
- Optional: Users can trigger SingleResults (Provided there are no errors)

All other documentation are inline

## How to publish to mediaone's marketing site?

1. Login to mediaonemarketing.com/cpanel
2. File Manager > public_html > app
3. Delete all files except .env
4. yarn run build
5. Zip(Compress) the contents in the build folder
6. Upload the new zip file to /public_html/app
7. Extract all contents in the zip file

## How to change password or update users?

1. Edit .env

## Required environment variables

| Variable            | Description                         |
| :------------------ | :---------------------------------- |
| REACT_APP_KEY       | Api key for kwfinder api            |
| REACT_APP_PASSWORD  | User password                       |
| REACT_APP_KWAPI     | Base URL for kwfinder service       |
| REACT_APP_CUSTOMAPI | Base URL for seochanges-api service |

# Services

## Mangools service

This is the main service and it contains all the required functions to get the data for the inputted url and keywords.

```src/services/mangools.js```

## PageSpeed Insights service

Send a request to seochanges-api to get the pagespeed insights score and core web vitals for the user inputted url.

```src/services/pagespeed-insights.js```

## Custom service

Send a request to seochanges-api to get the kwfinder credit balance and search engine simulator results.

```src/services/custom.js```

