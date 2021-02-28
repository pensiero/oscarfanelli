# Oscar Fanelli

Personal portfolio, [oscarfanelli.com](https://www.oscarfanelli.com).

You can find a ready-to-use docker image of this portfolio on [my Docker Hub account](https://hub.docker.com/r/pensiero/oscarfanelli/).

### How to setup on your local environment

Generate a self-signed SSL certificate
```
openssl req -x509 -out oscarfanelli.dev.crt -keyout oscarfanelli.dev.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=oscarfanelli.dev' -extensions EXT -config <( \
   printf "[dn]\nCN=oscarfanelli.dev,*.oscarfanelli.dev\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:oscarfanelli.dev,DNS:*.oscarfanelli.dev\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
and move its files to the `config/docker/nginx-proxy/certs/` folder
```
mv oscarfanelli.dev.* config/docker/certs/
```
_Note: You need to trust your self-signed certificates. Check how to do it on OSX ([add certificate](https://support.apple.com/guide/keychain-access/add-certificates-to-a-keychain-kyca2431/mac), [trust certificate](https://support.apple.com/guide/keychain-access/change-the-trust-settings-of-a-certificate-kyca11871/mac))._

Copy distribution files
```
cp docker-compose.override.yml.dist docker-compose.override.yml
```

Start docker containers
```
docker-compose up -d
```

In order to complete the setup, you need to install packages. Check out the next section.

### Install packages via package manager

Enter the web container
```
docker-compose exec web bash
```

Install with yarn:
```
yarn
```

(alternative) Install with npm:
```
npm install
```

Install bower packages
```
./node_modules/bower/bin/bower --allow-root install
```

### Run minifiers and compilers

This process is required only during development.
The image used in production contains all the necessary files minified and compiled.

Enter the web container
```
docker-compose exec web bash
```

Let minifiers and compilers run in the background, and watch for changes:
```
./config/docker/watchers/run.sh
```

(alternative, one-shot) via yarn:
```
yarn run compile
```

(alternative, one-shot) via npm:
```
npm run compile
```