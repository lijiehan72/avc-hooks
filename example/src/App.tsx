import { CacheRequest } from 'avc-hooks'
import 'avc-hooks/dist/index.css'
import React, { useEffect } from 'react'
import axios from 'axios'
import { Button } from 'antd'
import useModal from './useModal'


const cacheAxios = CacheRequest(axios,{
    updateKey:"updateKey", // 在请求中添加updateKey参数，当updateKey为true时，请求不会使用缓存，而是重新请求 默认：false
    cacheStore:"cacheStore" // 存储库名，默认：avc-cache
})
cacheAxios.interceptors.response.use((response: { data: any })=>{
    return response.data
})
export {
    cacheAxios
}


const App = () => {

    useEffect(() => {
        console.time('GET缓存请求')
        cacheAxios.get('http://127.0.0.1:8080/app', {
            params:{
                name: 'avc',
            }
        }).then((res: any) => {
            console.timeEnd('GET缓存请求')
            console.log("GET缓存结果",res)
        })
        // 更新缓存
        console.time('GET不读缓存')
        cacheAxios.get('http://127.0.0.1:8080/app2', {
            params:{
                name: 'avc',
                updateKey:true
            }
        }).then((res: any) => {
            console.timeEnd('GET不读缓存')
            console.log("GET不缓存结果",res)
        })

    }, [])

    const {
        createModal,
        updateModal
    } = useModal();

    return <>
        <Button
            onClick={() => {
                createModal.setOpen(true)
            }}
        >新增</Button>
        <Button
            onClick={() => {
                updateModal.setOpen({
                    id: 1,
                    name: '张三',
                    age: 20
                })
            }}
        >编辑</Button>
    </>
}

export default App
