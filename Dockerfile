FROM ubuntu:16.04

MAINTAINER Oscar Fanelli <oscar.fanelli@gmail.com>

ENV PROJECT_PATH=/var/www \
    DEBIAN_FRONTEND=noninteractive \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=www-data \
    APACHE_LOCK_DIR=/var/lock/apache2 \
    APACHE_PID_FILE=/var/run/apache2/apache2.pid \
    PHP_MODS_CONF=/etc/php/7.0/mods-available \
    PHP_INI=/etc/php/7.0/apache2/php.ini \
    TERM=xterm

# Utilities, Apache, PHP, and supplementary programs
RUN apt-get update -q && apt-get upgrade -yqq && apt-get install -yqq --force-yes \
    curl \
    git \
    npm \
    wget \
    apache2 \
    libapache2-mod-php7.0 \
    php7.0
RUN ln -s "$(which nodejs)" /usr/bin/node

# Apache mods
RUN a2enmod rewrite expires headers

# PHP.ini file: enable <? ?> tags and quieten logging
RUN sed -i "s/short_open_tag = Off/short_open_tag = On/" $PHP_INI && \
    sed -i "s/memory_limit = .*/memory_limit = 32M/" $PHP_INI && \
    sed -i "s/display_errors = .*/display_errors = Off/" $PHP_INI && \
    sed -i "s/display_startup_errors = .*/display_startup_errors = Off/" $PHP_INI && \
    sed -i "s/post_max_size = .*/post_max_size = 1M/" $PHP_INI && \
    sed -i "s/upload_max_filesize = .*/upload_max_filesize = 1M/" $PHP_INI && \
    sed -i "s/max_file_uploads = .*/max_file_uploads = 1/" $PHP_INI && \
    sed -i "s/error_reporting = .*$/error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT/" $PHP_INI

# Apache2 conf
RUN echo "ServerName localhost" | tee /etc/apache2/conf-available/fqdn.conf
RUN a2enconf fqdn

# Cleanup
RUN apt-get purge -yq \
      wget \
      zip \
      patch && \
    apt-get autoremove -yqq

# Port to expose
EXPOSE 80

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