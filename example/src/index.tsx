   import React from 'react';
   import ReactDOM from 'react-dom';
   import { ConfigProvider } from 'antd';
   import zhCN from 'antd/es/locale/zh_CN'; // 注意这里的路径变化
   import dayjs from 'dayjs'
   import App from './App';

   dayjs.locale('zh-cn'); // 如果使用dayjs

   ReactDOM.render(
     <ConfigProvider locale={zhCN}>
       <App />
     </ConfigProvider>,
     document.getElementById('root')
   );
   