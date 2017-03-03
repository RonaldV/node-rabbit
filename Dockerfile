FROM node:7.7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
#RUN npm install
RUN npm install --production

ENV PORT 3000
EXPOSE $PORT

CMD [ "npm", "start" ]


# FROM node:boron

# # Create app directory
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package.json /usr/src/app/
# RUN npm install

# # Bundle app source
# COPY . /usr/src/app

# EXPOSE 4567
# CMD [ "npm", "start" ]



# NOTE Using Docker when connecting to local RabbitMQ (unable to connect to localhost) ... IP 10.200.10.1
# sudo ifconfig lo0 alias 10.200.10.1/24
# Comment in ... rabbitmq-env.conf ...line ... NODE_IP_ADDRESS=127.0.0.1
# Add in ... rabbitmq.config : [ {rabbit, [ { tcp_listeners, [{"127.0.0.1", 5672}, {"10.200.10.1", 5672}]}, {loopback_users, []} ] } ].
# Use IP 10.200.10.1 instead of localhost