from node:alpine as client

RUN mkdir /app
WORKDIR /app
COPY client/ /app
RUN npm i
RUN npm run build


from node:alpine as server

RUN mkdir /app
WORKDIR /app
COPY server/ /app
RUN npm i
COPY --from=client /app/build /app/public/build
EXPOSE 80 80

ENV NODE_ENV="production"
CMD ["node", "index.js"]

