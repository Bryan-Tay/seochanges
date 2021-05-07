# MediaOne's Keyword Magic App

-   Flow: Login > UserInput > MainFunction > ResultsDisplay
-   Optional: Coefficients renders with ResultsDisplay
-   Optional: Users can trigger SingleResults (Provided there are no errors)

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
