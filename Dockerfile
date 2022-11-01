# Stage 0: install the base dependencies
# this Dockerfile is to define all of the Docker instructions necessary for Docker Engine to build an image of the service.
# apk update, apk upgrade, apk search, apk add, apk add --no-cache <curl>
# https://pkgs.alpinelinux.org/packages
#FROM node:16.18.0-bullseye@sha256:91473f227fcf3e4af8f2acfa1eeee922c0712d7bc4654f12a041b33259a8dd7c AS dependencies
# FROM nginx:alpine
FROM node:16.18-alpine3.16@sha256:2175727cef5cad4020cb77c8c101d56ed41d44fbe9b1157c54f820e3d345eab1 AS dependencies

LABEL maintainer="Van Hoan Tran <tvan-hoan@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# default to installation in a production way
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json ./


# Install node dependencies defined in package-lock.json
RUN npm ci --only=production 

# #################################################################
# Stage 1: 
#FROM node:16.18.0-bullseye@sha256:91473f227fcf3e4af8f2acfa1eeee922c0712d7bc4654f12a041b33259a8dd7c AS production
FROM node:16.18-alpine3.16@sha256:2175727cef5cad4020cb77c8c101d56ed41d44fbe9b1157c54f820e3d345eab1 AS production

# Use /app as our working directory
WORKDIR /app

# Copy the generated dependencies(node_modules)
COPY --from=dependencies --chown=node:node /app /app

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd
#################################################################
# Stage 1: 
#FROM node:16.18.0-bullseye@sha256:91473f227fcf3e4af8f2acfa1eeee922c0712d7bc4654f12a041b33259a8dd7c AS deployment
FROM node:16.18-alpine3.16@sha256:2175727cef5cad4020cb77c8c101d56ed41d44fbe9b1157c54f820e3d345eab1 AS deployment


# Use /app as our working directory
WORKDIR /app
RUN apk add --no-cache dumb-init=1.2.5

COPY --from=production --chown=node:node /app /app

# use a user group node
USER node

# use dumb-init as my container's entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the container by running our server
# CMD npm start
CMD ["node", "./src/server.js"]
# We run our service on port 8080
EXPOSE 8080

# Create a health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3  \
CMD wget --no-verbose --tries=3 --spider localhost:${PORT} || exit 1

# 1. Alpine Linux
# 2. official images
# 3. Be specific with your image versions
# 4. Design in Layers
#    - Least frequently changing layers go earlier(OS, tools, dependencies, source code, build/run)
#    - Most commands create temporary layers(WORKDIR, ENV, LABEL,etc)
#    - RUN, COPY create cachable, reusable layers
#    - Docker reuses existing layers whenever it can. Look at the checksum of files before doing a COPY again.
#    - Caching output
#      Run apt-get update && apt-get install -y \
#        bzr \
#        cvs \
#        git \
#        mercurial \
#        subversion \
#        && rm -rf /var/lib/apt/lists/*
# 5. Multi-Stage Builds
#    - Docker Images tend to get big fast
#        OS, Temporary files, buiding artifacts, development dependencies, unused tools
#    - Creating smaller images tokes works
#        + Seperate a build into stages
#        + use appropriate base images for each stage
#        + Copy desired artifacts from one stage to another, throwing away the rest
#    - Earlier stages can use large images(install), latter ones can use smaller(production)
#    - FROM node AS <stage-name>
#        + Each FROM can be given a stage name using AS <NAME>
#        + By default, Docker will start building at the final stage and work backwards
#        + You can start at a different stage using: Docker build --target <NAME>
#        + USeful for creating debug, test stages you can build, but usually don't bother
#    - COPY --FROM <stage-name>
#        + Anything created/installed in one stage can be copied to another
#    Example:
#    FROM node:16.14 AS dependencies
#    WORKDIR /app
#    COPY package*.json /app
#    RUN npm ci --only=production
#    ##############################################
#    FROM node:16.14-alpine AS production
#    COPY --chown=node:node --from=dependencies \
#    /app/node_modules /app/node_modules
# 6. Development vs. Production
#    - Understanding the different between devDependencies and dependencies
#        + devDependencies: needed to develop, run tests, build the code
#        + dependencies: needed to run the code
#    - An image usually defines how to run a Production version of the code
#        + devDependencies takes up space
#        + devDependencies potentially add unnecessary security risks
#    - Don't include what you don't need
#    Example: npm install?
#    - npm install
#        + OK: every time you run you'll get slightly different versions(package.json)
#    - npm install --production or NODE_ENV=production npm install
#        + Better: now we get don't install devDependencies
#    - npm ci --production
#        + Best: exact versions of dependencies only
#    ###############################################################
#    Explaination: NODE_ENV=production
#    - Your dependencies often include production optimizations
#        + Express will enable caching
#        + be less verbose in logging
#    - Not enabled by default. You have to opt-in
#        + const isDev = process.env.NODE_ENV !== 'production';
#    - specify via Environment Variable
#        + Dockerfile - define for the image by default
#           + ENV NODE_ENV=production
#        + Docker cli - override when you run the container
#           + docker run -e NODE_ENV=production
#        + .env - include as part of the environment file
#           + NODE_ENV=production
# 7. User
#    - You are not the root user when you use most images
#        + docker run --rm node whoami ->root
#    - You might need to be root in order to buid the image
#        + install dependencies
#    - You should almost never need to run as root
#        + Principle of Least Privilege
#        + if a hacker breaks into the container, they will have root access too
#        + Could try escape from the container, attack the host
#    - Many images include a least-privilege user
#        + node image has the 'root' and 'node' users
#        + nginx image has the 'root' and 'nginx' users
#    - USER node
#        + Change which user is running commands
#    - COPY -chown=node:node ./app
#        + Copy files and change ownership to node user, node group
#    Explaination chown in Unix
#    - Change file (or directory) ownership for
#        + user
#        + user:group
#    -USER and COPY -chown
#        + WORKDIR /app
#            + Copy files into image, change the owner to node user, group
#               COPY -chown=node:node ./app
#            + Install dependencies
#               run npm ci --only=production
#            + Switch user to node before we run the app
#               USER node
#               CMD npm start
# 8. Better init process
#    - pid=1 is our "init" process
#        + docker run --rm node whoami ->root
#    - The CMD you run becomes pid=1 in Docker
#        + pid=1 processes are handled different by Kernel
#        + Consider: npm start(npm process is the init, and it starts node)
#    - We need to run an init process that can properly manage our process
#        + Signal Handling(forwading signals)
#        + Graceful shutdown
#    - Linux Signal Handling
#        + Notify a process of an event
#        + processes can register signal handlers(functions to call on events)
#    - Names begin with SIG-followed by the actual name, some examples
#        + SIGINT -interupt (CTRL + C)
#        + SIGTERM - terminate (e.g., 'kill' command has been called)
#    - We need an init process to register handlers, pass them along to our process, and handle them ourself
#        + CTRL + c should cause us to stop accepting requests and gracefully shutdown
#    - Two common options
#        + dumb-init - https://github.com/Yelp/dumb-init
#        + tini - https://github.com/krallin/tini
#    - They run as pid=1
#    - Start our actual process
#    - Handle and forward signals to our process
#    - Will stop our process if the container is stopped
#    Explaination tini and dumb-init
#    - install one
#        + RUN apk install dumb-init
#        + RUN apk install tini
#    - Use it as your entrypointing(they work the same way)
#        + ENTRYPOINT ["/sbin/tini", "--"]
#           + Gets added to the front of any CMD run in the container
#        + CMD ["node", "server.js"]
#           + Our actual process(Note: we have used node vs npm, removing another process)
#           + Note["node", "server.js"] (exec, no shell) vs. node server.js(shell is started first)
#    - Use --init
#        + requeiring tini is so common now that Docker includes it by default
#        + docker run --init
#    - Later when we discuss docker-compose, we can do the same using: 
#        + init: true
#    - see https://docs.docker.com/compose/compose-file/compose-file-v3/#init
# 9. Healthcheck
#    - we can define a command to run in order to monitor the health of our container's process
#    - A web server typically includes some kind of "health check" rout
#        + return 200 if the service is OK
#        + Might also report on the status of connections to databases to other resources
#    - often curl is used to do the check. Note: make sure curl is installed before you reply on it
#        (e.g., not available in node-alpine images) or use wget
#    - Check the / route every 3 minutes, fail if we don't get a 200
#        + HEALTHCHECK -- interval=3m \
#          CMD curl --fail http://localhost:${PORT}/ || exit 1
#    - The container will get a "health status" added (se docker ps)
#    - After 3 fails attempts, the container becomes "unhealthy" and is stopped
# 10. Implement All These!
#    - Take some time to implement all of these in your project Dockerfiles
#    - fragments examples to container
#        + use an official, larger base node image for installing dependencies
#        + Only install production dependencies with npm ci -only=production
#        + use a multi-stage build
#        + pick an official, smaller base node image for production
#        + Use the node user vs. root
#        + Define the an automated health check
#        + Use tini and -init
#        + Run using NODE_ENV=production



