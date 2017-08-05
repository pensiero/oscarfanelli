FROM pensiero/apache-php

# Labels
LABEL maintainer "oscar.fanelli@gmail.com"

# PHP.ini file: enable <? ?> tags and quiet logging
RUN sed -i "s/display_errors = .*/display_errors = On/" $PHP_INI && \
    sed -i "s/display_startup_errors = .*/display_startup_errors = On/" $PHP_INI && \
    sed -i "s/error_reporting = .*/error_reporting = E_ALL | E_STRICT/" $PHP_INI

# VirtualHost
COPY config/docker/apache-virtualhost.conf /etc/apache2/sites-available/000-default.conf

# Move to project path directory
WORKDIR $PROJECT_PATH

# NPM install
COPY package.json ./package.json
RUN npm config set loglevel warn
RUN npm install --quiet --production

# Bower install
COPY bower.json ./bower.json
COPY .bowerrc ./.bowerrc
RUN $(npm bin -q)/bower install --allow-root --quiet

# Copy site into place
COPY . $PROJECT_PATH

# Generate assets
RUN bash ./config/docker/watchers/run.sh

# Remove pre-existent apache pid and start apache
CMD rm -f $APACHE_PID_FILE && ./config/docker/start/production.sh