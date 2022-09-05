FROM debian:latest

WORKDIR /var/www/html

# Updates
RUN apt-get update && apt-get -y upgrade

# Packages
RUN apt-get install -y apache2 curl git openssl zsh

# Intall ohmyzsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# SSL Certificates
RUN openssl req -x509 -out /etc/ssl/certs/dowdow.crt -keyout /etc/ssl/private/dowdow.key -newkey rsa:2048 -nodes -sha256 -subj "/C=FR/ST=Paris/L=Paris/O=Security/OU=Development/CN=dowdow.local"

# Apache vhosts
RUN a2enmod ssl
RUN a2enmod http2
COPY vhost.conf /etc/apache2/sites-available/vhost.conf
RUN a2ensite vhost.conf

# NodeJS
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs
RUN npm i -g npm

# Launch Apache
EXPOSE 80
EXPOSE 443
CMD apachectl -D FOREGROUND