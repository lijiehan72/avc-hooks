import { AxiosInstance } from 'axios';
interface CacheConfig {
    cacheStore?: string;
    updateKey?: string;
}
declare function XHR(axios: AxiosInstance, cacheConfig?: CacheConfig): AxiosInstance;
export default XHR;
