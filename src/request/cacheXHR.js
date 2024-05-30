import cloneDeep from './cloneDeep'


function XHR(axios,cacheConfig={}) {
    cacheConfig = {
        cacheStore: 'avc-cache',
        updateKey:'updateKey',
        ...cacheConfig
    }
    let cache = null;
    const responseBk = cloneDeep(axios.interceptors.response.handlers)
    const requestBk = cloneDeep(axios.interceptors.request.handlers)
    axios.interceptors.response.clear()
    axios.interceptors.request.clear()
    axios.interceptors.request.use(async (config)=> {
        let cacheKey = config.url;
        let update = false;
        if (config.method.toLowerCase() === 'get' && config.params) {
            if (config.params[cacheConfig.updateKey]){
                update = config.params?.[cacheConfig.updateKey];
                delete config.params[cacheConfig.updateKey];
            }
            cacheKey += '?' + new URLSearchParams(config.params).toString();
        }

        if (cache === null){
            cache = await caches.open(cacheConfig.cacheStore)
        }
        const response = await cache.match(cacheKey);
        if (response && !update) {
            const rr = await response.json();
            return Promise.reject({
                cacheData:rr
            })
        }
        return config;
    });
    axios.interceptors.request.use(async (config)=> {
        if (requestBk&&requestBk[0]&&requestBk[0].fulfilled){
            return requestBk[0].fulfilled(config)
        }
    }, (error) => {
        if (requestBk&&requestBk[0]&&requestBk[0].rejected){
            return requestBk[0].rejected(error)
        }
    });

    axios.interceptors.response.use(function (response) {
        // 请求成功时，根据修改后的规则保存响应结果到缓存
        let cacheKey = response.config.url;
        if (response.config.method.toLowerCase() === 'get' && response.config.params) {
            cacheKey += '?' + new URLSearchParams(response.config.params).toString();
        }
        cache.put(cacheKey,  new Response(JSON.stringify(response)))
        return response;
    }, function (error) {
        if (error.cacheData){
            return Promise.resolve(error.cacheData)
        }
        // 处理错误
        return Promise.reject(error);
    });
    
    axios.interceptors.response.use(async (response) => {
        if (responseBk&&responseBk[0]&&responseBk[0].fulfilled){
            return responseBk[0].fulfilled(response)
        }
        return response;
    }, (error) => {
        if (responseBk&&responseBk[0]&&responseBk[0].rejected){
            return responseBk[0].rejected(error)
        }
        return Promise.reject(error);
    })
    return axios;
}

export default XHR;
