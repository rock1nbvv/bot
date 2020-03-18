import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UsersAction from '../../actions/Users';

class Auth extends Component {
  componentDidMount() {
    const { createUser } = this.props;
    createUser({
      password: '1234',
      firstName: '1234',
      lastName: '1234',
      middleName: '123',
      login: Math.floor(Math.random() * Math.floor(160)).toString()
    });
  }

  render() {
    return <div>5555</div>;
  }
}

function mapStateToProps(state) {
  return { Users: state.Users };
}

function mapDispatchToProps(dispatch) {
  return {
    createUser: bindActionCreators(UsersAction.createUser, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
