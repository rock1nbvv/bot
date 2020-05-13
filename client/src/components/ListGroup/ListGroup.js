import React, { Component, createRef } from 'react';
import { Container } from '@material-ui/core';
import GroupsAPI from '../../services/Groups';
import MaterialTable from 'material-table';
import TableIcons from '../TableIcons/TableIcons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NotistackAction from '../../actions/Notistack';
import Button from '@material-ui/core/Button';

class ListGroup extends Component {
  constructor(props) {
    super(props);
    this.tableRef = createRef();
    this.state = {
      load: false
    };
  }

  loadData = query =>
    new Promise((resolve, reject) => {
      this.setState({ load: true });
      let { page, pageSize: limit } = query;
      page += 1;
      GroupsAPI.getAllGroups({ page, limit })
        .then(result => {
          let { docs: data, totalDocs, page } = result;
          const newdata = [...data];
          data.forEach(e => {
            const { _id } = e;
            e.students.forEach(student => {
              const { firstName, lastName, middleName, _id: studentID } = student;
              newdata.push({
                _id: studentID,
                parentId: _id,
                nameStudent: firstName + ' ' + lastName + ' ' + middleName
              });
            });
          });

          if (newdata.length === 0 && page !== 1) {
            page -= 1;
            GroupsAPI.getAllGroups({ page, limit }).then(res => {
              let { docs, totalDocs, page } = res;
              const newdataErrorPAge = [...docs];

              docs.forEach(e => {
                const { _id } = e;
                e.students.forEach(student => {
                  const { firstName, lastName, middleName, _id: studentID } = student;
                  newdataErrorPAge.push({
                    _id: studentID,
                    parentId: _id,
                    nameStudent: firstName + ' ' + lastName + ' ' + middleName
                  });
                });
              });

              return resolve({
                data: newdataErrorPAge,
                page: page - 1,
                totalCount: totalDocs
              });
            });
          } else {
            return resolve({
              data: newdata,
              page: page - 1,
              totalCount: totalDocs
            });
          }
        })
        .catch(() => {
          reject();
        })
        .finally(() => {
          this.setState({ load: false });
        });
    });

  deleteGroup = GroupData => {
    return new Promise((resolve, reject) => {
      const { enqueueSnackbar, closeSnackbar } = this.props;
      const { _id } = GroupData;
      GroupsAPI.deleteGroup(_id)
        .then(res => {
          enqueueSnackbar({
            message: 'Success update.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          resolve(res);
        })
        .catch(() => {
          enqueueSnackbar({
            message: 'Fail update.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'warning',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          reject();
        });
    });
  };

  createNewGroup = newData => {
    return new Promise((resolve, reject) => {
      const { enqueueSnackbar, closeSnackbar } = this.props;
      const { name } = newData;
      GroupsAPI.createGroup({ name })
        .then(res => {
          enqueueSnackbar({
            message: 'Success update.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          resolve(res);
        })
        .catch(() => {
          enqueueSnackbar({
            message: 'Fail update.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'warning',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          reject();
        });
    });
  };

  updateGroup = newData => {
    return new Promise((resolve, reject) => {
      const { enqueueSnackbar, closeSnackbar } = this.props;
      const { name, _id } = newData;
      GroupsAPI.editGroup(_id, name)
        .then(res => {
          enqueueSnackbar({
            message: 'Success update.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          resolve(res);
        })
        .catch(() => {
          enqueueSnackbar({
            message: 'Fail update.',
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'warning',
              action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
            }
          });
          reject();
        });
    });
  };

  render() {
    const { deleteGroup, updateGroup, createNewGroup, loadData, tableRef } = this;
    const { load } = this.state;
    return (
      <Container>
        <MaterialTable
          icons={TableIcons}
          columns={[
            { title: 'Group Name', field: 'name' },
            {
              title: 'Student name',
              field: 'nameStudent',
              editable: 'never',
              readonly: true,
              removable: true
            }
          ]}
          data={loadData}
          parentChildData={(row, rows) => rows.find(a => a._id === row.parentId)}
          editable={{
            onRowAdd: createNewGroup,
            onRowUpdate: updateGroup,
            onRowDelete: deleteGroup
          }}
          tableRef={tableRef}
          actions={[
            {
              icon: TableIcons.Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              onClick: () => tableRef.current && tableRef.current.onQueryChange()
            }
          ]}
          title="Group list"
          isLoading={load}
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

export default connect(null, mapDispatchToProps)(ListGroup);
