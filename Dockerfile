FROM node:alpine
MAINTAINER mlacaud <matlaca24@gmail.com>

ADD . ./node

WORKDIR node

ENTRYPOINT ["node", "src/index.js"]
