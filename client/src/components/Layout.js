import { Layout, Menu } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import Auth from './Auth';

const { Content, Sider } = Layout;

export default props => (
  <Router>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="md" collapsedWidth="0">
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['2']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="2">
            <NavLink to="/attendance">Attendance</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/reports">Reports</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ background: '#fbfbfb' }}>
          <div style={{ padding: '25px 5px 5px 5px', background: '#fbfbfb' }}>
            <Auth />
          </div>
        </Content>
      </Layout>
    </Layout>
  </Router>
);
