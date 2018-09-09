import { Layout, Menu, Icon } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import Attendance from './Attendance';
import About from './About';
import Reports from './Reports';
import LogoImage from '../logo.png';

const { Header, Content, Footer, Sider } = Layout;

export default props => (
  <Router>
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <NavLink to="/">Attendance</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/reports">Reports</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="user" />
            <span className="nav-text">
              <NavLink to="/about">About</NavLink>
            </span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{ margin: '0', minHeight: '100%', background: '#fbfbfb' }}
        >
          <div style={{ padding: '25px 5px 5px 5px', background: '#fbfbfb' }}>
            <Route key="1" path="/" exact="false" component={Attendance} />
            <Route key="2" path="/reports" component={Reports} />
            <Route key="3" path="/about" component={About} />
          </div>
        </Content>
      </Layout>
    </Layout>
  </Router>
);
