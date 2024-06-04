import React, { useEffect, useState } from 'react'
import {useFormModal} from "avc-hooks"
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { cacheAxios } from '../utils/request'
import type { UseFormModalReturnType } from 'avc-hooks'
interface FormValues {
    id?: number;
    name: string;
    age: number;
}
interface Option {
    value: string | number;
    label: string;
}
type ModalReturnTypeDictionary = {
    [key: string]: UseFormModalReturnType;
};
function UseModal(): ModalReturnTypeDictionary {
    const [options, setOptions] = useState<Option[]|[]>([])
    useEffect(() => {
        setTimeout(()=>{
            setOptions([
                {label:"唱",value:"唱"},
                {label:"跳",value:"跳"},
                {label:"rap",value:"rap"},
                {label:"篮球",value:"篮球"}
            ])
        },5000)
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
        <Form.Item
            label={"测试下拉框"}
            name={"test"}
        >
            <Select options={options} />
        </Form.Item>
    </>
    const createModal = useFormModal({
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
    },[options])
    const updateModal = useFormModal({
        title: '编辑弹窗',
        content,
        onOk(values: FormValues) {
            return cacheAxios.post('http://127.0.0.1:8080/data', values).then(()=>{
                return {
                    status: true,
                    message: "编辑成功"
                };
            })
        },
    },[options])
    const delModal = useFormModal({
        title: '删除',
        content:'确定删除吗？',
        onOk(values: FormValues) {
            return cacheAxios.post('http://127.0.0.1:8080/data', values).then(()=>{
                return {
                    status: true,
                    message: "删除成功"
                };
            })
        },
    },[options])
    return {
        createModal,
        updateModal,
        delModal
    }
}

export default function(){
    const {createModal,updateModal,delModal} = UseModal()
    return <>
        <Button
            onClick={() => {
                createModal.setOpen(true)
            }}
            type={"primary"}
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
        <Button
            type={'primary'}
            danger={true}
            onClick={() => {
                delModal.setOpen({
                    id: 1
                })
            }}
        >
            删除
        </Button>
    </>
}