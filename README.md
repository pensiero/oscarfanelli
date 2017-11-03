# Oscar Fanelli

Personal portfolio, [oscarfanelli.com](https://www.oscarfanelli.com).

You can find a ready-to-use docker image of this portfolio on [my Docker Hub account](https://hub.docker.com/r/pensiero/oscarfanelli/).

## How to deploy

### Update to the latest release

```
git pull
```

### Install packages via package manager

With yarn:
```
yarn
```

With npm:
```
npm install
```

### Run minifiers and compilers

Direct run of the script:
```
./config/docker/watchers/run.sh
```

Via yarn:
```
yarn run compile
```

Via npm:
```
npm run compile
```