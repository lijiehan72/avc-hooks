import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface CacheConfig {
    cacheStore?: string;
    updateKey?: string;
}

function XHR(axios: AxiosInstance, cacheConfig: CacheConfig = {}): AxiosInstance {
    cacheConfig = {
        cacheStore: 'avc-cache',
        updateKey: 'updateKey',
        ...cacheConfig,
    };

    let cache: Cache | null = null;

    // @ts-ignore
    axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
            if (config.method?.toLowerCase() !== 'get') {
                return config;
            }

            let cacheKey = config.url || '';
            let update = false;

            if (config.params) {
                const params = config.params as Record<string, any>;
                const updateKey = cacheConfig.updateKey;
                if (updateKey && params[updateKey]) {
                    update = params[updateKey];
                    delete params[updateKey];
                }
                cacheKey += '?' + new URLSearchParams(params).toString();
            }

            if (cache === null) {
                cache = await caches.open(cacheConfig.cacheStore!);
            }

            const response = await cache.match(cacheKey);
            if (response && !update) {
                const rr = await response.json();
                return Promise.reject({
                    cacheData: rr,
                });
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        async (response: AxiosResponse) => {
            if (response.config.method?.toLowerCase() !== 'get') {
                return response;
            }

            let cacheKey = response.config.url || '';
            if (response.config.params) {
                cacheKey += '?' + new URLSearchParams(response.config.params).toString();
            }

            await cache!.put(cacheKey, new Response(JSON.stringify(response)));

            return response;
        },
        (error) => {
            if (error.cacheData) {
                return Promise.resolve(error.cacheData);
            }

            return Promise.reject(error);
        }
    );

    return axios;
}

export default XHR;
