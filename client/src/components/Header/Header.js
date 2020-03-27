import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import { bindActionCreators } from 'redux';
import * as UsersAction from '../../actions/Users';
import { connect } from 'react-redux';
import Auth from '../Auth/Auth';
import Box from '@material-ui/core/Box';
import './Header.scss';
import SettingsIcon from '@material-ui/icons/Settings';
import StyledLink from '../styled/StyledLink';
import { Drawer } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDrawer: false,
      isOpenDrawerAdmin: false
    };
  }

  toggleDrawer = () => {
    this.setState({
      isOpenDrawer: !this.state.isOpenDrawer
    });
  };
  toggleDrawerAdmin = () => {
    this.setState({
      isOpenDrawerAdmin: !this.state.isOpenDrawerAdmin
    });
  };

  render() {
    const { toggleDrawer, toggleDrawerAdmin } = this;
    const { isOpenDrawer, isOpenDrawerAdmin } = this.state;
    const { openWindowAuth, signOut } = this.props;
    const {
      isAuthorization,
      personalInfo: { isAdmin }
    } = this.props.Users;
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={toggleDrawer} edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <StyledLink className={'admin-btn'} to={'/'} color="inherit">
            <Typography variant="h6">Home</Typography>
          </StyledLink>
          <Box className={'header-main-block'} display="flex" justifyContent="flex-end" m={1}>
            {isAuthorization ? (
              <Box>
                <Button onClick={signOut} color="inherit">
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Box>
                <Button onClick={openWindowAuth} color="inherit">
                  Login
                </Button>
              </Box>
            )}
            {isAdmin && (
              <IconButton
                onClick={toggleDrawerAdmin}
                edge="start"
                color="inherit"
                aria-label="menu"
              >
                <SettingsIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
        <Auth />
        <Drawer open={isOpenDrawer} onClose={toggleDrawer}>
          <List>
            <ListItem onClick={toggleDrawer}>
              <StyledLink to={'/schedule'}>Schedule</StyledLink>
            </ListItem>
            <ListItem onClick={toggleDrawer}>
              <StyledLink to={'/personal'}>Personal information</StyledLink>
            </ListItem>
          </List>
        </Drawer>
        <Drawer anchor={'right'} open={isOpenDrawerAdmin && isAdmin} onClose={toggleDrawerAdmin}>
          <List>
            <ListItem onClick={toggleDrawerAdmin}>
              <StyledLink to={'/newEvent'}>Create event</StyledLink>
            </ListItem>
            <ListItem onClick={toggleDrawerAdmin}>
              <StyledLink to={'/newGroup'}>Create group</StyledLink>
            </ListItem>
            <ListItem onClick={toggleDrawerAdmin}>
              <StyledLink to={'/listsGroups'}>Lists groups</StyledLink>
            </ListItem>
          </List>
        </Drawer>
      </AppBar>
    );
  }
}

function mapStateToProps(state) {
  return { Users: state.Users };
}

function mapDispatchToProps(dispatch) {
  return {
    openWindowAuth: bindActionCreators(UsersAction.openWindowAuth, dispatch),
    signOut: bindActionCreators(UsersAction.signOut, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
