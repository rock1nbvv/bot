import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import GroupsAPI from '../../../services/Groups';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        description: ''
      },
      schedule: false,
      selectedGroup: '',
      group: [],
      date: new Date()
    };
  }

  componentDidMount() {
    GroupsAPI.getGroupList().then(res => {
      console.log(res);
      this.setState({ selectedGroup: res[0]._id });

      this.setState({ group: res });
    });
  }

  handleChange = event => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
  };

  handleChangeGroup = event => {
    this.setState({ selectedGroup: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { submit } = this.props;
    let {
      schedule,
      formData: { name, description },
      selectedGroup,
      date
    } = this.state;

    let nowAddFiveMinutes = new Date();
    nowAddFiveMinutes.setMinutes(nowAddFiveMinutes.getMinutes() + 5);
    if (date < nowAddFiveMinutes) {
      date = nowAddFiveMinutes;
    }

    submit({
      schedule,
      name,
      description,
      selectedGroup,
      date
    });
  };

  handleChangeStatus = () => {
    this.setState({ schedule: !this.state.schedule });
  };

  handleDateChange = e => {
    this.setState({ date: e });
  };
  render() {
    const {
      handleChange,
      handleChangeGroup,
      handleSubmit,
      handleChangeStatus,
      handleDateChange
    } = this;
    const {
      schedule,
      formData: { name, description },
      selectedGroup,
      group,
      date
    } = this.state;

    return (
      <ValidatorForm ref="form" onSubmit={handleSubmit} onError={errors => console.log(errors)}>
        <TextValidator
          margin="normal"
          label="Name"
          onChange={handleChange}
          name="name"
          fullWidth
          value={name}
          variant="outlined"
          validators={['required']}
          errorMessages={['This field is required']}
        />
        <TextValidator
          margin="normal"
          label="Description"
          onChange={handleChange}
          name="description"
          fullWidth
          value={description}
          variant="outlined"
          validators={['required']}
          errorMessages={['This field is required']}
        />
        <Select
          labelId="demo-simple-select-group"
          id="demo-group-select"
          fullWidth
          value={selectedGroup}
          onChange={handleChangeGroup}
        >
          {group.map(g => {
            const { _id, name } = g;
            return (
              <MenuItem key={_id} value={_id}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
        <FormControlLabel
          control={<Checkbox checked={schedule} onChange={handleChangeStatus} name="checkedF" />}
          label="Schedule event"
        />
        <Box my={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              disabled={!schedule}
              label="DateTimePicker"
              inputVariant="outlined"
              value={date}
              ampm={false}
              animateYearScrolling={true}
              disablePast={true}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Create event
        </Button>
      </ValidatorForm>
    );
  }
}

export default EventForm;
