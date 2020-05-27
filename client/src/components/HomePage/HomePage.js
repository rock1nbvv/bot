import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import MaterialTable from 'material-table';
import EventsAPI from '../../services/Events';
import Typography from '@material-ui/core/Typography';
import TableIcons from '../TableIcons/TableIcons';
import { connect } from 'react-redux';
import HomePageUnAuth from '../HomePageUnAuth/HomePageUnAuth';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      page: 0,
      limit: 9
    };
  }

  componentDidMount() {}

  loadData = query =>
    new Promise((resolve, reject) => {
      let { page, pageSize: limit } = query;
      page += 1;

      EventsAPI.getAllEventsByGroup({ page, limit })
        .then(value => {
          const { docs: data, totalDocs, page } = value;
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

  render() {
    const { loadData } = this;
    const { isAuthorization } = this.props.Users;
    return (
      <>
        {isAuthorization ? (
          <Container>
            <MaterialTable
              icons={TableIcons}
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Description', field: 'description' },
                {
                  title: 'Due Date',
                  field: 'date',
                  render: rowData => (
                    <Typography variant={'body2'}>
                      {new Date(rowData.date).toGMTString()}
                    </Typography>
                  )
                }
              ]}
              data={loadData}
              title="List event"
            />
          </Container>
        ) : (
          <HomePageUnAuth />
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return { Users: state.Users };
}

export default connect(mapStateToProps, null)(HomePage);
