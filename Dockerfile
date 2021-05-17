FROM node:15.0.1
WORKDIR /promopal

# Copy package.json separately so when we edit the source code, it won't run yarn install each time.
# When we edit the source code and do not change package.json, Docker will then cache the next steps so we don't end up running these steps again.
COPY package.json .
COPY yarn.lock .

# NODE_ENV will determine if we attach --production, see https://classic.yarnpkg.com/en/docs/cli/install/#toc-yarn-install-production-true-false
RUN yarn install

# build
COPY . ./
RUN yarn run build

# CMD is executed when we run the container. Everything above is executed when we build the image.
CMD yarn run start
