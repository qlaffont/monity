# 🖥 Monity

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/qlaffont/monity/graphs/commit-activity) ![Travis (.com)](https://img.shields.io/travis/com/qlaffont/monity) ![David](https://img.shields.io/david/qlaffont/monity)

![GitHub issues](https://img.shields.io/github/issues/qlaffont/monity) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

![GitHub stars](https://img.shields.io/github/stars/qlaffont/monity?style=social) [![Docker Pulls](https://img.shields.io/docker/pulls/qlaffont/monity)](https://hub.docker.com/r/qlaffont/monity)

Website and Server Monitor

- Check Website Status + Response Time
- Check if port is open + Response Time
- Export Metrics in Prometheus
- Send Webhook when status code change (Slack/Discord)

---

## Install

Requirements :

 - MongoDB
 - Node.JS (v13)

```sh
npm run build && npm run start
```

Or you can use docker image (don't contain mongodb server)

```sh
  docker pull qlaffont/monity
```

---

## Documentation

REST Documentation is accessible at the address [http://localhost:5000/documentation](http://localhost:5000/documentation).

To setup checkers, you can go to [http://localhost:5000/setup](http://localhost:5000/setup).

To know the process to get auth token, you can go to [http://localhost:5000/setup/auth](http://localhost:5000/setup/auth).

---

## Environment Variables

| Environment Variable (* = required) | Description                                                                                             | Example                                  |
|-------------------------------------|---------------------------------------------------------------------------------------------------------|------------------------------------------|
| PORT                                | Change default port <br><br>(Default: 5000)                                                             | process.env.PORT=5000                    |
| MONGODB_URI *                       | MongoDB Connection URI                                                                                  | process.env.MONGODB_URI=""               |
| NODE_ENV                            | If NODE_ENV === "production", it will disable rest documentation access.                                | process.env.NODE_ENV="production"        |
| AUTH_SECRET                         | Define JWT Secret Key. <br>We strongly recommend to generate one.<br><br><br>(Default: 'monity-secret') | process.env.AUTH_SECRET="MySecretJWTKey" |
| DEBUG_WORKER                        | Display Command send to Worker.<br><br>(Default: false)                                                 | process.env.DEBUG_WORKER=true            |
| DISABLE_AUTH                        | Disable Authentication and block access to API.<br><br>(Default: false)                                 | process.env.DISABLE_AUTH=true            |
| WEBHOOK_URL                         | URL to call when Status Code Change (ex: Slack/Discord)                                                 | process.env.WEBHOOK_URL="myurl"          |
| WEBHOOK_MESSAGE                     | Markdown Message to use for webhook                                                                     | process.env.WEBHOOK_MESSAGE="NEW STATUS" |
| DISABLE_PROMETHEUS                  | Disable Prometheus Export                                                                               | process.env.DISABLE_PROMETHEUS=true      |

---

## Webhook

To activate webhook, you need to add `WEBHOOK_URL` in your environment variable.

To create a custom `WEBHOOK_MESSAGE`, you can use these variables in your message:

| Template Variables     | Description     |
|------------------------|-----------------|
| \*\|checkerName\|\*    | Checker Name    |
| \*\|checkerAddress\|\* | Checker Address |
| \*\|oldStatusCode\|\*  | Old Status Code |
| \*\|newStatusCode\|\*  | New Status Code |

Default Message :

```markdown
:information_source: **Status Changed** :information_source: \n __Checker__ : **|checkerName|** \n __Status Code__ : ~~*|oldStatusCode|*~~ to ***|newStatusCode|*** \n __Address__ : ***|checkerAddress|*** \n\n Powered by Monity
```

---

## Issues

If you have any problems, please contact us through a [GitHub issue](https://github.com/qlaffont/monity/issues).

## Contributing

You are invited to contribute new features, fixes, or updates, large or small. Regarding a pull request, tests need to pass to be merged.
