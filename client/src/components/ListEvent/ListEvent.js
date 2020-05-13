import React, { Component, createRef } from 'react';
import { Container } from '@material-ui/core';
import MaterialTable from 'material-table';
import TableIcons from '../TableIcons/TableIcons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NotistackAction from '../../actions/Notistack';
import Button from '@material-ui/core/Button';
import EventsAPI from '../../services/Events';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import EventForm from './EventForm/EventForm';
import Typography from '@material-ui/core/Typography';

class ListEvent extends Component {
  constructor(props) {
    super(props);
    this.tableRef = createRef();
    this.state = {
      data: [],
      load: false,
      sendDataStatus: 'success',
      sendDataMessage: '',
      openDialog: false
    };
  }

  loadData = query =>
    new Promise((resolve, reject) => {
      let { page, pageSize: limit } = query;
      page += 1;
      EventsAPI.getAllEvents({ page, limit })
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

  addEvent = () => {
    this.setState({ openDialog: true });
  };
  onCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  createNewEvent = newData => {
    const { enqueueSnackbar, closeSnackbar } = this.props;
    const { schedule, name, description, selectedGroup, date } = newData;
    let typeEvent = !schedule ? EventsAPI.createScheduledEvent : EventsAPI.createEvent;

    console.log(date);

    typeEvent({
      name,
      description,
      date: date.toISOString(),
      groupId: selectedGroup
    })
      .then(res => {
        console.log(res);
        enqueueSnackbar({
          message: 'Successful update',
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
          }
        });
      })
      .catch(res => {
        enqueueSnackbar({
          message: 'Failed update',
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'warning',
            action: key => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
          }
        });
      })
      .finally(() => {
        this.setState({ openDialog: false });
      });
  };

  render() {
    const { addEvent, createNewEvent, loadData, tableRef, onCloseDialog } = this;
    const { openDialog } = this.state;
    return (
      <Container>
        <MaterialTable
          icons={TableIcons}
          columns={[
            { title: 'Event name', field: 'name' },
            { title: 'Group', field: 'groupId.name', editable: 'never' },
            { title: 'Description', field: 'description' },
            {
              title: 'Due Date',
              field: 'date',
              render: rowData => (
                <Typography variant={'body2'}>{new Date(rowData.date).toString()}</Typography>
              )
            },
            { title: 'Status', field: 'status', type: 'boolean', editable: 'never' }
          ]}
          data={loadData}
          tableRef={tableRef}
          actions={[
            {
              icon: TableIcons.Add,
              tooltip: 'Create Event',
              isFreeAction: true,
              onClick: addEvent
            },
            {
              icon: TableIcons.Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              onClick: () => tableRef.current && tableRef.current.onQueryChange()
            }
          ]}
          title="Event list"
        />
        <Dialog open={openDialog} onClose={onCloseDialog} aria-labelledby="form-dialog-title">
          <DialogContent>
            <EventForm submit={createNewEvent} />
          </DialogContent>
        </Dialog>
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

export default connect(null, mapDispatchToProps)(ListEvent);
