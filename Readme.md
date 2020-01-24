# Monity

Website Monitor (Response Code, Response Time, Prometheus Compatibility)

| Environment Variable (* = required) | Description                                                                                             | Example                                  |
|-------------------------------------|---------------------------------------------------------------------------------------------------------|------------------------------------------|
| PORT                                | Change default port <br><br>(Default: 3000)                                                             | process.env.PORT=3000                    |
| AUTH_SECRET                         | Define JWT Secret Key. <br>We strongly recommend to generate one.<br><br><br>(Default: 'monity-secret') | process.env.AUTH_SECRET="MySecretJWTKey" |
| DEBUG_WORKER                        | Display Command send to Worker.<br><br>(Default: false)                                                 | process.env.DEBUG_WORKER=true            |
| DISABLE_AUTH                        | Disable Authentication and block access to API.<br><br>(Default: false)                                 | process.env.DISABLE_AUTH=true            |
