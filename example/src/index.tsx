   import React from 'react';
   import { ConfigProvider } from 'antd';
   import zhCN from 'antd/es/locale/zh_CN'; // 注意这里的路径变化
   import dayjs from 'dayjs'
   import App from './App';
   import { createRoot } from 'react-dom/client'

   dayjs.locale('zh-cn'); // 如果使用dayjs
    // @ts-ignore
   createRoot(document.getElementById('root')).render(<>
        <ConfigProvider locale={zhCN}>
            <App />
        </ConfigProvider>
    </>)
   