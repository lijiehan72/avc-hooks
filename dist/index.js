var React = require('react');

function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    var _copy = [];
    for (var i = 0; i < obj.length; i++) {
      _copy[i] = cloneDeep(obj[i]);
    }
    return _copy;
  }
  var copy = {};
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = cloneDeep(obj[key]);
    }
  }
  return copy;
}

function XHR(axios, cacheConfig) {
  if (cacheConfig === void 0) {
    cacheConfig = {
      cacheStore: 'avc'
    };
  }
  var cache = null;
  var bk = cloneDeep(axios.interceptors.response.handlers);
  axios.interceptors.response.clear();
  axios.interceptors.request.use(function (config) {
    try {
      var _temp3 = function _temp3() {
        return Promise.resolve(cache.match(cacheKey)).then(function (response) {
          var _exit = false;
          var _temp = function () {
            if (response) {
              return Promise.resolve(response.json()).then(function (rr) {
                var _Promise$reject = Promise.reject({
                  cacheData: rr
                });
                _exit = true;
                return _Promise$reject;
              });
            }
          }();
          return _temp && _temp.then ? _temp.then(function (_result) {
            return _exit ? _result : config;
          }) : _exit ? _temp : config;
        });
      };
      var cacheKey = config.url;
      if (config.method.toLowerCase() === 'get' && config.params) {
        cacheKey += '?' + new URLSearchParams(config.params).toString();
      }
      var _temp2 = function () {
        if (cache === null) {
          return Promise.resolve(caches.open(cacheConfig.cacheStore)).then(function (_caches$open) {
            cache = _caches$open;
          });
        }
      }();
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2));
    } catch (e) {
      return Promise.reject(e);
    }
  });
  axios.interceptors.response.use(function (response) {
    var cacheKey = response.config.url;
    if (response.config.method.toLowerCase() === 'get' && response.config.params) {
      cacheKey += '?' + new URLSearchParams(response.config.params).toString();
    }
    cache.put(cacheKey, new Response(JSON.stringify(response)));
    return response;
  }, function (error) {
    if (error.cacheData) {
      return Promise.resolve(error.cacheData);
    }
    return Promise.reject(error);
  });
  axios.interceptors.response.use(function (response) {
    try {
      if (bk && bk[0] && bk[0].fulfilled) {
        return Promise.resolve(bk[0].fulfilled(response));
      }
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }, function (error) {
    if (bk && bk[0] && bk[0].rejected) {
      return bk[0].rejected(error);
    }
    return Promise.reject(error);
  });
  return axios;
}

var styles = {"test":"_styles-module__test__3ybTi"};

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return React.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};
var CacheRequest = XHR;

exports.CacheRequest = CacheRequest;
exports.ExampleComponent = ExampleComponent;
//# sourceMappingURL=index.js.map
