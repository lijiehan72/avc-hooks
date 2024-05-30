import { createElement } from 'react';

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

function XHR(axios, cacheConfig = {
  cacheStore: 'avc'
}) {
  let cache = null;
  const bk = cloneDeep(axios.interceptors.response.handlers);
  axios.interceptors.response.clear();
  axios.interceptors.request.use(async config => {
    let cacheKey = config.url;
    if (config.method.toLowerCase() === 'get' && config.params) {
      cacheKey += '?' + new URLSearchParams(config.params).toString();
    }
    if (cache === null) {
      cache = await caches.open(cacheConfig.cacheStore);
    }
    const response = await cache.match(cacheKey);
    if (response) {
      const rr = await response.json();
      return Promise.reject({
        cacheData: rr
      });
    }
    return config;
  });
  axios.interceptors.response.use(function (response) {
    let cacheKey = response.config.url;
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
  axios.interceptors.response.use(async response => {
    if (bk && bk[0] && bk[0].fulfilled) {
      return bk[0].fulfilled(response);
    }
    return response;
  }, error => {
    if (bk && bk[0] && bk[0].rejected) {
      return bk[0].rejected(error);
    }
    return Promise.reject(error);
  });
  return axios;
}

var styles = {"test":"_styles-module__test__3ybTi"};

const ExampleComponent = ({
  text
}) => {
  return createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};
const CacheRequest = XHR;

export { CacheRequest, ExampleComponent };
//# sourceMappingURL=index.modern.js.map
