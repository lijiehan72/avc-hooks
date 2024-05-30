import React from 'react';

function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    const _copy = [];
    for (let i = 0; i < obj.length; i++) {
      _copy[i] = cloneDeep(obj[i]);
    }
    return _copy;
  }
  const copy = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = cloneDeep(obj[key]);
    }
  }
  return copy;
}

function XHR(axios, cacheConfig = {}) {
  cacheConfig = {
    cacheStore: 'avc-cache',
    updateKey: 'updateKey',
    ...cacheConfig
  };
  let cache = null;
  const responseBk = cloneDeep(axios.interceptors.response.handlers);
  const requestBk = cloneDeep(axios.interceptors.request.handlers);
  axios.interceptors.response.clear();
  axios.interceptors.request.clear();
  axios.interceptors.request.use(async config => {
    if (config.method.toLowerCase() !== 'get') {
      return config;
    }
    let cacheKey = config.url;
    let update = false;
    if (config.method.toLowerCase() === 'get' && config.params) {
      if (config.params[cacheConfig.updateKey]) {
        var _config$params;
        update = (_config$params = config.params) === null || _config$params === void 0 ? void 0 : _config$params[cacheConfig.updateKey];
        delete config.params[cacheConfig.updateKey];
      }
      cacheKey += '?' + new URLSearchParams(config.params).toString();
    }
    if (cache === null) {
      cache = await caches.open(cacheConfig.cacheStore);
    }
    const response = await cache.match(cacheKey);
    if (response && !update) {
      const rr = await response.json();
      return Promise.reject({
        cacheData: rr
      });
    }
    if (requestBk && requestBk[0] && requestBk[0].fulfilled) {
      return requestBk[0].fulfilled(config);
    }
    return config;
  }, error => {
    if (requestBk && requestBk[0] && requestBk[0].rejected) {
      return requestBk[0].rejected(error);
    }
    return Promise.reject(error);
  });
  axios.interceptors.response.use(function (response) {
    if (response.config.method.toLowerCase() !== 'get') {
      return response;
    }
    let cacheKey = response.config.url;
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

const ExampleComponent = ({
  text
}) => {
  return React.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};
const cacheRequest = XHR;

export { ExampleComponent, cacheRequest };
//# sourceMappingURL=index.modern.js.map
