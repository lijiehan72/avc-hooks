import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN' // 注意这里的路径变化
import dayjs from 'dayjs'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './cms/Layout'
import FormModal from './demo/FormModal'
import "./index.css"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'formModal',
                element: <FormModal />
            },
            {
                path: '/',
                element: <Navigate to="/formModal" replace />,
            },
        ]
    }
])

dayjs.locale('zh-cn') // 如果使用dayjs
// @ts-ignore
createRoot(document.getElementById('root')).render(<>
    <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
    </ConfigProvider>
</>)
   