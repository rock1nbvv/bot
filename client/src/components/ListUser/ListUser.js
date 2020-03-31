import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import UsersAPI from '../../services/Users';
import MaterialTable from 'material-table';
import TableIcons from '../TableIcons/TableIcons';
import { bindActionCreators } from 'redux';
import * as NotistackAction from '../../actions/Notistack';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

class ListUser extends Component {
  loadData = query =>
    new Promise((resolve, reject) => {
      let { page, pageSize: limit } = query;
      page += 1;
      UsersAPI.getAllUserForAdmin({ page, limit })
        .then(result => {
          const { docs: data, totalDocs, page } = result;
          resolve({
            data,
            page: page - 1,
            totalCount: totalDocs
          });
        })
        .catch(() => {
          reject([]);
        });
    });

  onRowUpdate = newData =>
    new Promise((resolve, reject) => {
      const { _id: idUser, isAdmin: status } = newData;
      const { enqueueSnackbar, closeSnackbar } = this.props;
      UsersAPI.setAdminStatus({ idUser, status })
        .then(() => {
          enqueueSnackbar({
            message: 'Success change status.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          resolve();
        })
        .catch(() => {
          enqueueSnackbar({
            message: 'Fail change status.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'warning',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          reject();
        });
    });

  render() {
    const { loadData, onRowUpdate } = this;
    return (
      <Container>
        <MaterialTable
          icons={TableIcons}
          columns={[
            { title: 'Login', field: 'login', editable: 'never' },
            { title: 'FirstName', field: 'firstName', editable: 'never' },
            { title: 'LastName', field: 'lastName', editable: 'never' },
            { title: 'middleName', field: 'middleName', editable: 'never' },
            {
              title: 'Is Admin',
              field: 'isAdmin',
              type: 'boolean'
            }
          ]}
          data={loadData}
          editable={{
            onRowUpdate: onRowUpdate
          }}
          title="User list"
        />
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    enqueueSnackbar: bindActionCreators(NotistackAction.enqueueSnackbar, dispatch),
    closeSnackbar: bindActionCreators(NotistackAction.closeSnackbar, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ListUser);
