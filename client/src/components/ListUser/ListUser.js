import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import UsersAPI from '../../services/Users';
import MaterialTable from 'material-table';
import TableIcons from '../TableIcons/TableIcons';

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
      UsersAPI.setAdminStatus({ idUser, status })
        .then(() => {
          resolve();
        })
        .catch(() => {
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

export default ListUser;
