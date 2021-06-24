FROM node:13.12.0-alpine

WORKDIR /app

ENV REACT_APP_KEY=8fb40ae3e00fefeac51878d30ed77e2302e8da4acdfe3ff96600de6b14c73328
ENV REACT_APP_PASSWORD=bM5!xS3_oB
ENV REACT_APP_KWAPI=https://api.mangools.com/v2/kwfinder
ENV REACT_APP_CREDITSAPI=https://seochanges-api.vercel.app/alpine

COPY package.json .
COPY package-lock.json .
RUN npm install --silent

COPY . .

CMD ["npm", "start"]