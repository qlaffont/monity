
## 1.0.3 (2020-03-03)


### Bug Fixes

* **ssr:** fix SSR ([0eb6db6](https://github.com/qlaffont/monity/commit/0eb6db6cae9b913044a83d4509fb7c3cef078ade))


## 1.0.2 (2020-03-02)


### Bug Fixes

* **server:** wait Mongoose Connection + Fix Domain Error with Axios ([0e588ca](https://github.com/qlaffont/monity/commit/0e588ca95ea7c329b3f953a35252f682eea01cdc))

## 1.0.1 (2020-03-01)


### Bug Fixes

* **server.ts:** fix Docker Build ([2fdf6f3](https://github.com/qlaffont/monity/commit/2fdf6f3d295d485c70a3432ffc04584868d0d454))



# 1.0.0 (2020-02-26)


### Bug Fixes

* **authservice:** fix issues + Add FastifyInstanceAuth ([8d296f2](https://github.com/qlaffont/monity/commit/8d296f273dde9aec969a8361dd487ca58f6a22b1))
* **checkers:** fix Schema validation (to access to group information) ([8b88439](https://github.com/qlaffont/monity/commit/8b884393799485d774674d4e88432cbd27ff3058))
* **dashboard:** fix React Error ([9112e69](https://github.com/qlaffont/monity/commit/9112e69f4adba365e8826df9590d3cc980ac7f82))
* **dashboard:** take only last metric for renderStatusChecker ([43ecce8](https://github.com/qlaffont/monity/commit/43ecce8404b66fb5d0a1e5b219e8076e7fcca316))
* **http service:** export Methods ([19454e3](https://github.com/qlaffont/monity/commit/19454e350c3e0d7911d569939b7dbc779ac71500))
* **httphandlingservice:** fix issue due to Boom migration ([150a887](https://github.com/qlaffont/monity/commit/150a887c8f21a195ea8582d25dda3d88c753ce38))
* **language:** fix Language in Export + Fix Latency on start ([9a895bf](https://github.com/qlaffont/monity/commit/9a895bf60bc46dca83767699815c3f742ba83e35))
* **metrics:** fix Colors Metrics Index Page ([380221e](https://github.com/qlaffont/monity/commit/380221e9e670ab93715bb99faba40f57630b834e))
* **metrics:** fix Display ([a489190](https://github.com/qlaffont/monity/commit/a489190d0f2aa1815bc1d325b64e48831322d754))
* **metrics:** fix Metrics Export + Metrics page ([5a17fb8](https://github.com/qlaffont/monity/commit/5a17fb882932313c1dcaa02380a0ff077e50ef10))
* **metrics:** fix Some issues when we have no metrics ([63f1f28](https://github.com/qlaffont/monity/commit/63f1f285caea97fb60ba218f1a5a6f4cfe22e43b))
* **metrics:** fix Webhook ([3ebb06b](https://github.com/qlaffont/monity/commit/3ebb06b8b66510ac99f7b67c5bdb3d2a7ec78f7b))
* **prometheus:** fix Issue when metric is not found ([4e62286](https://github.com/qlaffont/monity/commit/4e62286196ace25314946991de7c6e5dc7c3a7d0))
* **renderchecker:** fix React issue ([60be17d](https://github.com/qlaffont/monity/commit/60be17dbeef72d6ce58f99ebd03453e35f3dbf2c))
* **web:** fix issues ([4e00777](https://github.com/qlaffont/monity/commit/4e00777a225be39dd8c113d966076a474dad082a))
* **web:** fix Token Error ([12e56dd](https://github.com/qlaffont/monity/commit/12e56dddcfe14c2d5860b1cc873a615f28acd812))
* **worker:** fix Issue regarding pingCall + Finish Test for worker ([ea1dcf0](https://github.com/qlaffont/monity/commit/ea1dcf053a87c5742090ea2259e81bc6eeb6e6d6))
* **worker:** fix Main Thread in Worker process ([2a03118](https://github.com/qlaffont/monity/commit/2a03118f78f004c76c1d48740f51273f3d5bd7e9))


### Features

* **metrics:** add Metrics Routes/Controller/Service ([1902a4a](https://github.com/qlaffont/monity/commit/1902a4af6993826b064f3437476c8f64538eb61a))
* 🎸 Init Architecture Next Fastify ([e03fbfd](https://github.com/qlaffont/monity/commit/e03fbfdd348050710a7b9d0a5b94610213cf1cce))
* **add groups routes:** add Groups Routes/Controller/Service + Edit Worker + Edit Group Sche/Serv ([7e0a802](https://github.com/qlaffont/monity/commit/7e0a802f85f1b44d65b51b540a702d2dda5f1b07))
* **auth:** add Authentication Routes ([65f0947](https://github.com/qlaffont/monity/commit/65f0947315a430c9b25849637921d209200937bb))
* **authservice:** implement Auth Service by Token + Add authToken Decoration in Fastify Instance ([dd39c2c](https://github.com/qlaffont/monity/commit/dd39c2c5f5f8428c5b15497f695baac6d0bd1f43))
* **authstore:** store token in cookies storage ([f5454e6](https://github.com/qlaffont/monity/commit/f5454e65691d00858e1983897f8287a85cc66443))
* **autoclean:** add the possibility to clean metrics data every 8 days ([e31b317](https://github.com/qlaffont/monity/commit/e31b317e66f757768208019ba081f73ab099d2ac))
* **checker:** able to Start/Stop Checker + Autoload Checker on start ([8b3a38a](https://github.com/qlaffont/monity/commit/8b3a38abb44d0dab21e9478c38996b0710262424))
* **checker:** add Checker Web Pages ([7df4b92](https://github.com/qlaffont/monity/commit/7df4b92a4678669d4f9db8822a9704db834ad174))
* **dashboard:** add Dashboard page + Routes/Services/Tests ([880555a](https://github.com/qlaffont/monity/commit/880555ace95f992544f0830412d5cdf335de0eb2))
* **group:** add Group Routes/Controller/Service ([7fd6389](https://github.com/qlaffont/monity/commit/7fd638994d6fa603d5bc7d5784529c0333eacf35))
* **groups:** able to edit Groups from Web Interface ([8149aed](https://github.com/qlaffont/monity/commit/8149aed4e8c0e83d49ce1ba9b72933dfcd5b90c8))
* **http:** add Http Service to have standard in API Response ([9011e6f](https://github.com/qlaffont/monity/commit/9011e6fea8e80cba557d4a33abf37f4714222506))
* **metrics:** add Export Metrics and fix issue on metrics date ([17a821a](https://github.com/qlaffont/monity/commit/17a821a593c08487267785547b2c51c17854a60e))
* **metrics:** add Metrics Index Page ([9ad7fd4](https://github.com/qlaffont/monity/commit/9ad7fd4c7202d1584d8ec515d76587a7e46a12d5))
* **metrics:** add Metrics Page on Setup ([901302b](https://github.com/qlaffont/monity/commit/901302b8b47b4f5a443fc0ae2efde3ca5769c091))
* **prometheus:** add Prometheus support ([683f0c9](https://github.com/qlaffont/monity/commit/683f0c901d16fe776748181f786b0214deca7403))
* **routes:** add Ping Route ([d26a0a9](https://github.com/qlaffont/monity/commit/d26a0a9e9b4a867d4adc159ccaa27d08de73cfeb))
* **server:** add Mongooose Connector (MongoDB) ([4eae377](https://github.com/qlaffont/monity/commit/4eae377984f5310adf4c3a6e0a42ca9ec47c4801))
* **server:** add Swagger Generation + Helmet ([ed1aab7](https://github.com/qlaffont/monity/commit/ed1aab72701fe8d8007e7cb6fb92c370c4bf9acd))
* **server:** edit CORS ([b45a783](https://github.com/qlaffont/monity/commit/b45a783da5a96ceb7575bbc150253f5e046931d7))
* **web:** add Web Client + Bulma + Auth Page ([f483def](https://github.com/qlaffont/monity/commit/f483deffdce03daafe42b5eef6e8588a16c4319f))
* **webhook:** have the possibility to be notify when status code change ([12caeb4](https://github.com/qlaffont/monity/commit/12caeb419e4adebe555766a0aa02b5ac4b17aa20))
* **worker:** v1 Worker + Call HTTP / Ping ([38a99ef](https://github.com/qlaffont/monity/commit/38a99efca603dc65e723f18fafd7ca7386809a97))



