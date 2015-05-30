FROM  node:0.12-slim
MAINTAINER Adam Magaluk

ADD     . /
WORKDIR /
RUN     npm install

EXPOSE 8125

CMD        ["start"]
ENTRYPOINT ["npm"]
