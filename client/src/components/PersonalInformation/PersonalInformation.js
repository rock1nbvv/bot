import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import * as UsersAction from '../../actions/Users';
import { connect } from 'react-redux';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import InputAdornment from '@material-ui/core/InputAdornment';
import { RemoveRedEye, VisibilityOff } from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TelegramLoginButton from 'react-telegram-login';

class PersonalInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        password: '',
        repeatPassword: '',
        login: '',
        firstName: '',
        lastName: '',
        middleName: ''
      },
      passwordIsMasked: true,
      repeatPasswordIsMasked: true
    };
  }

  loadUserData = () => {
    const { firstName, lastName, middleName, login } = this.props.Users.personalInfo;
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        login: login
      }
    });
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', value => {
      const { formData } = this.state;
      return value === formData.password;
    });
    this.loadUserData();
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  togglePasswordMask = () => {
    this.setState(prevState => ({
      passwordIsMasked: !prevState.passwordIsMasked
    }));
  };
  toggleRepeatPasswordMask = () => {
    this.setState(prevState => ({
      repeatPasswordIsMasked: !prevState.repeatPasswordIsMasked
    }));
  };
  handleChange = event => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { formData } = this.state;
    const { editPersonalData } = this.props;
    editPersonalData(formData);
  };
  handleSubmitChangePassword = e => {
    e.preventDefault();
    const { password } = this.state.formData;
    const { editPersonalData } = this.props;
    editPersonalData({ password });
  };

  handleTelegramResponse = response => {
    const { connectUserToTelegram } = this.props;
    connectUserToTelegram(response);
  };
  disconnectTelegram = () => {
    const { telegramId } = this.props.Users.personalInfo;
    const { disconnectUserToTelegram } = this.props;
    disconnectUserToTelegram({ telegramId });
  };

  render() {
    const {
      togglePasswordMask,
      toggleRepeatPasswordMask,
      handleChange,
      handleSubmit,
      handleTelegramResponse,
      disconnectTelegram,
      handleSubmitChangePassword
    } = this;
    const {
      formData: { firstName, lastName, middleName, login, password, repeatPassword },
      passwordIsMasked,
      repeatPasswordIsMasked
    } = this.state;
    const { telegramId } = this.props.Users.personalInfo;
    return (
      <Container>
        <DialogTitle id="auth-dialog">Personal data</DialogTitle>
        {!telegramId ? (
          <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="ROCK1NBVV_bot" />
        ) : (
          <Box mt={1} onClick={disconnectTelegram}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Disconnect telegram
            </Button>
          </Box>
        )}

        <ValidatorForm ref="form" onSubmit={handleSubmit} onError={errors => console.log(errors)}>
          <TextValidator
            margin="normal"
            label="First name"
            onChange={handleChange}
            name="firstName"
            fullWidth
            value={firstName}
            variant="outlined"
          />
          <TextValidator
            margin="normal"
            label="Last name"
            onChange={handleChange}
            name="lastName"
            fullWidth
            value={lastName}
            variant="outlined"
          />
          <TextValidator
            margin="normal"
            label="Middle name"
            onChange={handleChange}
            name="middleName"
            fullWidth
            value={middleName}
            variant="outlined"
          />
          <TextValidator
            margin="normal"
            label="Login"
            onChange={handleChange}
            name="login"
            fullWidth
            value={login}
            variant="outlined"
          />

          <Box mt={1}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Edit data
            </Button>
          </Box>
        </ValidatorForm>
        <ValidatorForm
          ref="form"
          onSubmit={handleSubmitChangePassword}
          onError={errors => console.log(errors)}
        >
          <TextValidator
            type={passwordIsMasked ? 'password' : 'text'}
            margin="normal"
            label="Password"
            onChange={handleChange}
            name="password"
            fullWidth
            variant="outlined"
            value={password}
            validators={['required']}
            errorMessages={['This field is required']}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={togglePasswordMask}
                  className="password-eyes"
                >
                  {passwordIsMasked ? <RemoveRedEye /> : <VisibilityOff />}
                </InputAdornment>
              )
            }}
          />
          <TextValidator
            type={repeatPasswordIsMasked ? 'password' : 'text'}
            margin="normal"
            label="Repeat password"
            onChange={handleChange}
            name="repeatPassword"
            fullWidth
            variant="outlined"
            validators={['isPasswordMatch', 'required']}
            errorMessages={['Password mismatch', 'This field is required']}
            value={repeatPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={toggleRepeatPasswordMask}
                  className="password-eyes"
                >
                  {repeatPasswordIsMasked ? <RemoveRedEye /> : <VisibilityOff />}
                </InputAdornment>
              )
            }}
          />
          <Box mt={1}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Change password
            </Button>
          </Box>
        </ValidatorForm>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return { Users: state.Users };
}

function mapDispatchToProps(dispatch) {
  return {
    editPersonalData: bindActionCreators(UsersAction.editPersonalData, dispatch),
    connectUserToTelegram: bindActionCreators(UsersAction.connectUserToTelegram, dispatch),
    disconnectUserToTelegram: bindActionCreators(UsersAction.disconnectUserToTelegram, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation);
