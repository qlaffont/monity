# Monity

Website Monitor (Response Code, Response Time, Prometheus Compatibility)

| Environment Variable (* = required) | Description                                                                                             | Example                                  |
|-------------------------------------|---------------------------------------------------------------------------------------------------------|------------------------------------------|
| PORT                                | Change default port <br><br>(Default: 3000)                                                             | process.env.PORT=3000                    |
| AUTH_SECRET                         | Define JWT Secret Key. <br>We strongly recommend to generate one.<br><br><br>(Default: 'monity-secret') | process.env.AUTH_SECRET="MySecretJWTKey" |
| DEBUG_WORKER                        | Display Command send to Worker.<br><br>(Default: false)                                                 | process.env.DEBUG_WORKER=true            |
| DISABLE_AUTH                        | Disable Authentication and block access to API.<br><br>(Default: false)                                 | process.env.DISABLE_AUTH=true            |
| WEBHOOK_URL                         | URL to call when Status Code Change (ex: Slack/Discord)                                                 | process.env.WEBHOOK_URL="myurl"          |
| WEBHOOK_MESSAGE                     | Markdown Message to use for webhook                                                                     | process.env.WEBHOOK_MESSAGE="NEW STATUS" |

## Webhook

If you want to receive an alert when status code change for one checker you can use this variables in your WEBHOOK_MESSAGE :

| Template Variables     | Description     |
|------------------------|-----------------|
| \*\|checkerName\|\*    | Checker Name    |
| \*\|checkerAddress\|\* | Checker Address |
| \*\|oldStatusCode\|\*  | Old Status Code |
| \*\|newStatusCode\|\*  | New Status Code |

Example :

```markdown
:information_source: **Status Changed** :information_source: \n __Checker__ : **|checkerName|** \n __Status Code__ : ~~*|oldStatusCode|*~~ to ***|newStatusCode|*** \n __Address__ : ***|checkerAddress|*** \n\n Powered by Monity
```
