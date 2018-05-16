const PROXY_CONFIG = {
  "/search/**": {
    "target": "http://localhost:8983/solr/",
    "ignorePath": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/search":""
    },
    "changeOrigin": false,
    "secure": false
  },
  "/api/**": {
    "target": "https://kramerius.lib.cas.cz/search/api/v5.0",
    "ignorePath": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api":""
    },
    "changeOrigin": false,
    "secure": false
  },
  "/img": {
    "target0": "http://localhost:8082/k5journals/img",
    "target": "https://kramerius.lib.cas.cz/search/img",
    "target1": "http://cdk.lib.cas.cz/search/api/v5.0",
    "target2": "http://kramerius.lib.cas.cz/search/api/v5.0",
    "pathRewrite": {
      "^/img":""
    },
    "logLevel": "debug",
    "changeOrigin": true,
    "secure": false
  },
  "/texts/**": {
    "target": "http://localhost:8082/k5journals/texts",
    "logLevel": "debug",
    "bypass": function (req, res, proxyOptions) {
          //return "/assets/test/news.json";
          
          const objectToReturn2 = 	{"api.point":"http:\/\/localhost:8080\/admin-master"};
			res.end(JSON.stringify(objectToReturn2));


          return true;
//        if (req.headers.accept.indexOf("html") !== -1) {
//            console.log("Skipping proxy for browser request.");
//        }
//        req.headers["X-Custom-Header"] = "yes";
    },
//    "pathRewrite": {
//      "^/texts":""
//    },
    "changeOrigin": false,
    "secure": false
  },
  "/lf": {
    "target": "http://localhost:8082/k5journals/lf",
    "logLevel": "debug",
    "pathRewrite": {
      "^/lf":""
    },
    "changeOrigin": false,
    "secure": false
  },
  "/login": {
    "target2": "http://localhost:8082/k5journals/login",
    "target": "http://localhost:4200/assets/test/user.json",
    "logLevel": "debug",
    "pathRewrite": {
      "^/login":""
    },
    "changeOrigin": false,
    "secure": false
  },
  "/index": {
    "target": "http://localhost:8082/k5journals/index",
    "logLevel": "debug",
    "pathRewrite": {
      "^/index":""
    },
    "changeOrigin": false,
    "secure": false
  },
  "/search_": {
    "target": "https://kramerius.lib.cas.cz/search/api/v5.0/search",
    "ignorePath": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/search":""
    },
    "changeOrigin": false,
    "secure": false
  }
};
module.exports = PROXY_CONFIG;