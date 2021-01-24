FROM node:14
WORKDIR /blockchain
COPY package.json .
COPY dist dist
ENV PORT=8600
RUN npm install
EXPOSE 8600
CMD ["npm", "run", "serve"]