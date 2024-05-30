import { CacheRequest, ExampleComponent } from 'avc-hooks'
import 'avc-hooks/dist/index.css'
import React, { useEffect } from 'react'
import axios from 'axios'
axios.interceptors.response.use(response=>{
    return response.data
})
const cacheAxios = CacheRequest(axios,{
    updateKey:"updateKey", // 在请求中添加updateKey参数，当updateKey为true时，请求不会使用缓存，而是重新请求 默认：false
    cacheStore:"cacheStore" // 存储库名，默认：avc-cache
})
export {
    cacheAxios,
    axios
}
// @ts-ignore
const App = () => {
    useEffect(() => {
        console.time('请求')
        cacheAxios.get('http://127.0.0.1:8080/app', {
            params:{
                name: 'avc',
                updateKey:true
            }
        }).then(res => {
            console.timeEnd('请求')
            console.log("结果",res)
        })
        axios.post('http://127.0.0.1:8080/app2', {}).then(res => {
            console.log("结果",res)
        })
    }, [])
    return <ExampleComponent text="Create React Library Example 😄" />
}

export default App
