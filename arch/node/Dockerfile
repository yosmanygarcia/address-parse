FROM node:lts

RUN apt-get update

# Install required system packages for libpostal
RUN apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        autoconf \
        automake \
        libtool \
        pkg-config && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    rm -rf /var/lib/apt/lists/*

# Install libpostal
RUN git clone https://github.com/openvenues/libpostal /opt/libpostal && \
    cd /opt/libpostal && \
    ./bootstrap.sh && \
    ./configure --datadir=/usr/local/share/libpostal && \
    make && \
    make install && \
    ldconfig && \
    rm -rf /opt/libpostal

# Install required libs by node-gyp
RUN apt-get install -y --no-install-recommends \
    python3

# Install node-gyp globally
RUN npm install -g node-gyp

# Setup app directory
WORKDIR /app

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Optionally remove devDependencies after build
RUN npm prune --production

# Set user
USER node

CMD ["node", "dist/index.js"]
