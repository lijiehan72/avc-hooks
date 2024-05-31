# avc-hooks

## 一个用于缓存axios数据的npm包

### 安装

```bash 
npm install avc-hooks
# 或者
yarn add avc-hooks
# 或者
pnpm add avc-hooks
```
### 使用

```javascript
import axios from 'axios' 
import { CacheRequest } from 'avc-hooks'
// 初始化缓存axios实例，设置可选参数 
const cacheAxios = CacheRequest(axios, { 
    updateKey: "updateKey", // 在请求中添加updateKey参数，当updateKey为true时，请求不会使用缓存，而是重新请求，默认：false 
    cacheStore: "cacheStore", // 存储库名，默认：avc-cache 
})
// 计时开始 console.time('请求')
// 发起GET请求，示例中设置updateKey为true以忽略缓存并更新 
cacheAxios.get('http://127.0.0.1:8080/app', { 
    params: { 
        name: 'avc', 
        updateKey: true, // 此处的updateKey 为注册时的updateKey，为true时，请求不会使用缓存，而是重新请求，并更新缓存。false或者不传时，请求会使用缓存 
    }, 
}).then(res => { 
    console.timeEnd('请求') 
    console.log("结果", res) 
})
```

### 特性

- 自动缓存axios请求结果
- 请求参数中通过`updateKey`控制是否使用缓存或更新缓存
- 可自定义存储库名称

### 注意事项

- 此包仅适用于基本的数据类型，复杂类型如函数、日期等可能无法正确缓存
- 缓存依赖浏览器的`caches` API，可能在某些环境中不可用

# useFormModal

`useFormModal` 是一个自定义的 React Hook，用于管理表单弹窗的显示、数据加载、提交等逻辑。

## Props

| 属性名        | 类型                                               | 必填 | 默认值 | 说明                                                                                      |
| ------------- | -------------------------------------------------- | ---- | ------ |-----------------------------------------------------------------------------------------|
| title         | React.ReactNode                                    | 是   | -      | 弹窗标题                                                                                    |
| content       | React.ReactNode \| ((form: FormInstance) => React.ReactNode) | 是   | -      | 表单内容，可以是 ReactNode 或一个函数，接收 `form` 作为参数返回 ReactNode                                     |
| mounted       | (data: any, form: FormInstance) => void            | 否   | -      | 页面加载完成时的回调函数，接收两个参数 `data` 和 `form`，其中 `data` 为初始数据，`form` 为表单实例                        |
| unmount       | () => void                                         | 否   | -      | 弹窗卸载之前执行的回调函数                                                                           |
| onOk          | (values: FormValues) => Promise<{ status: boolean, message?: string }> | 是   | -      | 点击确认按钮后的回调函数，接收表单收集的数据作为参数，返回一个 Promise，包含一个对象，其中 `status` 表示操作是否成功，`message` 表示操作结果的消息 |
| formArgs      | Record<string, any>                                | 否   | {}     | 表单的额外参数配置，详情见 Antd Form 组件                                                              |


## 返回值

| 属性名   | 类型          | 说明                     |
| -------- | ------------- | ------------------------ |
| setOpen  | (open: boolean \| Record<string, any>) => void | 控制弹窗显示或隐藏的函数 |
| form     | FormInstance  | 表单实例                 |
| getValues| () => FormValues | 获取表单收集的数据       |

## 示例

```jsx
import React from 'react';
import {UseFormModal} from 'avc-hooks';

function ExampleFormModal() {
  const handleOk = async (values) => {
    // 模拟提交表单数据
    return { status: true, message: '操作成功' };
  };

  const showModal = () => {
    formModal.setOpen(true);
    // 也可以传入表单默认值，如下
    // formModal.setOpen({
    //     id: 1, //编辑时传入id，onOk会返回
    //     name: '张三',
    //     age: 20
    // })
  };

  const formModal = UseFormModal({
    title: '示例表单弹窗',
    content: (
      <div>
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
      </div>
    ),
    onOk: handleOk,
  },[]);

  return (
    <div>
      <button onClick={showModal}>打开表单弹窗</button>
      
    </div>
  );
}

export default ExampleFormModal;
```

### 贡献与反馈

欢迎提出问题、建议或贡献代码。如果你遇到任何问题，可以创建一个[新Issue](https://github.com/lijiehan72/avc-hooks)。


### 许可

[MIT License](https://choosealicense.com/licenses/mit/)

