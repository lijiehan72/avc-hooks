import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: '1',
    label: <Link to="/formModal">表单模态框</Link>,
  },
  // 可以根据需要添加更多菜单项
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
      <Layout className={"body-wrap"}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" items={items} defaultSelectedKeys={['1']} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
  );
};

export default App;
