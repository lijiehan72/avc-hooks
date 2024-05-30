function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

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
    cacheConfig = {};
  }
  cacheConfig = _extends({
    cacheStore: 'avc-cache',
    updateKey: 'updateKey'
  }, cacheConfig);
  var cache = null;
  var responseBk = cloneDeep(axios.interceptors.response.handlers);
  var requestBk = cloneDeep(axios.interceptors.request.handlers);
  axios.interceptors.response.clear();
  axios.interceptors.request.clear();
  axios.interceptors.request.use(function (config) {
    try {
      var _temp4 = function _temp4() {
        return Promise.resolve(cache.match(cacheKey)).then(function (response) {
          var _exit = false;
          function _temp2(_result) {
            return _exit ? _result : requestBk && requestBk[0] && requestBk[0].fulfilled ? requestBk[0].fulfilled(config) : config;
          }
          var _temp = function () {
            if (response && !update) {
              return Promise.resolve(response.json()).then(function (rr) {
                var _Promise$reject = Promise.reject({
                  cacheData: rr
                });
                _exit = true;
                return _Promise$reject;
              });
            }
          }();
          return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
        });
      };
      if (config.method.toLowerCase() !== 'get') {
        return Promise.resolve(config);
      }
      var cacheKey = config.url;
      var update = false;
      if (config.method.toLowerCase() === 'get' && config.params) {
        if (config.params[cacheConfig.updateKey]) {
          var _config$params;
          update = (_config$params = config.params) === null || _config$params === void 0 ? void 0 : _config$params[cacheConfig.updateKey];
          delete config.params[cacheConfig.updateKey];
        }
        cacheKey += '?' + new URLSearchParams(config.params).toString();
      }
      var _temp3 = function () {
        if (cache === null) {
          return Promise.resolve(caches.open(cacheConfig.cacheStore)).then(function (_caches$open) {
            cache = _caches$open;
          });
        }
      }();
      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
    } catch (e) {
      return Promise.reject(e);
    }
  }, function (error) {
    if (requestBk && requestBk[0] && requestBk[0].rejected) {
      return requestBk[0].rejected(error);
    }
    return Promise.reject(error);
  });
  axios.interceptors.response.use(function (response) {
    if (response.config.method.toLowerCase() !== 'get') {
      return response;
    }
    var cacheKey = response.config.url;
    if (response.config.method.toLowerCase() === 'get' && response.config.params) {
      cacheKey += '?' + new URLSearchParams(response.config.params).toString();
    }
    cache.put(cacheKey, new Response(JSON.stringify(response)));
    if (responseBk && responseBk[0] && responseBk[0].fulfilled) {
      return responseBk[0].fulfilled(response);
    }
    return response;
  }, function (error) {
    if (error.cacheData) {
      return Promise.resolve(error.cacheData);
    }
    if (responseBk && responseBk[0] && responseBk[0].rejected) {
      return responseBk[0].rejected(error);
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
var cacheRequest = XHR;

exports.ExampleComponent = ExampleComponent;
exports.cacheRequest = cacheRequest;
//# sourceMappingURL=index.js.map
