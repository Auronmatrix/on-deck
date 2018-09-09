import { Layout, Menu } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import Attendance from './Attendance';
import Reports from './Reports';

const { Content, Sider } = Layout;

export default props => (
  <Router>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="md" collapsedWidth="0">
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1">
            <NavLink to="/">Attendance</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/reports">Reports</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ background: '#fbfbfb' }}>
          <div style={{ padding: '25px 5px 5px 5px', background: '#fbfbfb' }}>
            <Route key="1" path="/" exact="false" component={Attendance} />
            <Route key="2" path="/reports" component={Reports} />
          </div>
        </Content>
      </Layout>
    </Layout>
  </Router>
);
