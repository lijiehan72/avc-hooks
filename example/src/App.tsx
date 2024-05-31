import { CacheRequest,useFormModal } from 'avc-hooks'
import 'avc-hooks/dist/index.css'
import React, { useEffect } from 'react'
import axios from 'axios'
import { Button, Form, Input, InputNumber } from 'antd'
const cacheAxios = CacheRequest(axios,{
    updateKey:"updateKey", // 在请求中添加updateKey参数，当updateKey为true时，请求不会使用缓存，而是重新请求 默认：false
    cacheStore:"cacheStore" // 存储库名，默认：avc-cache
})
cacheAxios.interceptors.response.use(response=>{
    return response.data
})

interface FormValues {
    id?: number;
    name: string;
    age: number;
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
        console.time('POST请求')
        cacheAxios.post('http://127.0.0.1:8080/data', {}).then((res: any) => {
            console.timeEnd('POST请求')
            console.log("POST结果",res)
        })
    }, [])
    const content = <>
        <Form.Item
            label={"姓名"}
            name={"name"}
        >
            <Input placeholder={"请输入姓名"} />
        </Form.Item>
        <Form.Item
            label={"年龄"}
            name={"age"}
        >
            <InputNumber placeholder={"请输入年龄"} />
        </Form.Item>
    </>
    const testFormModal = useFormModal({
        title: '创建弹窗',
        content,
        onOk(values: FormValues){
            return cacheAxios.post('http://127.0.0.1:8080/data', values).then(() => {
                return {
                    status: true,
                    message: "创建成功"
                }
            })
        }
    },[]);
    const updateModal = useFormModal({
        title: '编辑弹窗',
        content,
        onOk(values:FormValues){
            return cacheAxios.post('http://127.0.0.1:8080/data', values).then(() => {
                return {
                    status: true,
                    message: "修改成功"
                }
            }).catch(() => {
                return {
                    status: false,
                    message: "修改失败"
                }
            })
        }
    })
    return <>
        <Button
            onClick={() => {
                testFormModal.setOpen(true)
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
