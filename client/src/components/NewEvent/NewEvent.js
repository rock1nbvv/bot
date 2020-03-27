import React, { Component } from 'react';

import { Container } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: '',
      selectedDate: new Date()
    };
  }

  handleDateChange = e => this.setState({ selectedDate: e });

  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { handleDateChange, handleChange, handleSubmit } = this;
    const { selectedDate, event } = this.state;
    return (
      <Container>
        <Typography variant={'h1'}>NewEvent</Typography>
        <ValidatorForm ref="form" onSubmit={handleSubmit} onError={errors => console.log(errors)}>
          <TextValidator
            margin="normal"
            label="Description event"
            onChange={handleChange}
            name="event"
            fullWidth
            value={event}
            variant="outlined"
            validators={['required']}
            errorMessages={['This field is required']}
          />
          <Box mt={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                variant="inline"
                label="Basic example"
                value={selectedDate}
                disablePast
                onChange={handleDateChange}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box mt={2} mb={2}>
            <Button type="submit" variant="contained" color="primary">
              Create event
            </Button>
          </Box>
        </ValidatorForm>
      </Container>
    );
  }
}

export default NewEvent;
