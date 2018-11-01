import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import Attendance from './Attendance';
import Reports from './Reports';
import { Button, Input, Form, Icon, Col, notification } from 'antd';
import sjcl from 'sjcl';
const FormItem = Form.Item;

// TODO: Replace with actual auth ASAP!
const terribleTempAuth = {
  isAuthenticated: false,
  authenticate(e, cb) {
    e.preventDefault();
    const uname = e.target[0].value;
    const pwd = e.target[1].value;
    const bitArray = sjcl.hash.sha256.hash(uname + pwd);
    const hash = sjcl.codec.hex.fromBits(bitArray);

    // Replace with proper auth api
    // User: test
    // Pass: test

    if (
      hash ===
      '03ffdf45276dd38ffac79b0e9c6c14d89d9113ad783d5922580f4c66a3305591'
    ) {
      this.isAuthenticated = true;
      setTimeout(cb, 100);
    } else {
      notification.error({
        message: 'Invalid Username/Password Specified'
      });
    }
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };
  login = () => {
    terribleTempAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }));
    });
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      terribleTempAuth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const AuthComponent = withRouter(
  ({ history }) =>
    terribleTempAuth.isAuthenticated ? (
      <p>
        <Button
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          icon="logout"
          onClick={() => {
            terribleTempAuth.signout(() => history.push('/'));
          }}
        />
      </p>
    ) : (
      <Col span={12}>
        <h2>Login</h2>
        <Form
          onSubmit={e => {
            e.preventDefault();
            terribleTempAuth.authenticate(e, () => history.push('/attendance'));
          }}
          className="login-form"
        >
          <FormItem>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          </FormItem>
          <FormItem>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          </FormItem>
          <Button
            icon="login"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Login
          </Button>
        </Form>
      </Col>
    )
);

export default function Auth() {
  return (
    <div>
      <AuthComponent />
      <PrivateRoute path="/attendance" exact="false" component={Attendance} />
      <PrivateRoute path="/reports" component={Reports} />
    </div>
  );
}
