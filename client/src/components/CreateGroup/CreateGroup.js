import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import * as GroupsAction from '../../actions/Groups';
import { connect } from 'react-redux';

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  handleChange = event => this.setState({ [event.target.name]: event.target.value });
  handleSubmit = e => {
    e.preventDefault();
    const { name } = this.state;
    const { createGroup } = this.props;
    createGroup({ name });
  };

  render() {
    const { handleChange, handleSubmit } = this;
    const { name } = this.state;
    const { load } = this.props.Groups;
    return (
      <Container>
        <Typography variant={'h1'}>Create a new group</Typography>
        <ValidatorForm ref="form" onSubmit={handleSubmit} onError={errors => console.log(errors)}>
          <TextValidator
            margin="normal"
            label="Enter a name group"
            onChange={handleChange}
            name="name"
            fullWidth
            value={name}
            variant="outlined"
            validators={['required']}
            errorMessages={['This field is required']}
          />
          <Box mt={2} mb={2}>
            <Button disabled={load} type="submit" fullWidth variant="contained" color="primary">
              Create group
            </Button>
          </Box>
        </ValidatorForm>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return { Groups: state.Groups };
}

function mapDispatchToProps(dispatch) {
  return {
    createGroup: bindActionCreators(GroupsAction.createGroup, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
