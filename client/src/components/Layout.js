import { Layout, Menu, Breadcrumb } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import Attendance from './Attendance';
import About from './About';
import Reports from './Reports';

const { Header, Content, Footer } = Layout;

export default props => (
  <Router>
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <NavLink to="/">Attendance</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/reports">Reports</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/about">About</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <Route key="1" path="/" exact="false" component={Attendance} />
          <Route key="2" path="/reports" component={Reports} />
          <Route key="3" path="/about" component={About} />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Prototyped with heart</Footer>
    </Layout>
  </Router>
);
