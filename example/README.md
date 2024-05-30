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

### 贡献与反馈

欢迎提出问题、建议或贡献代码。如果你遇到任何问题，可以创建一个[新Issue](https://github.com/your-github-repo-name/avc-hooks/issues/new)。

### 许可

[MIT License](https://choosealicense.com/licenses/mit/)
