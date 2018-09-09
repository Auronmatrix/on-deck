import React, { Component } from 'react';
import {
  Badge,
  Button,
  Avatar,
  Popover,
  notification,
  DatePicker,
  Row,
  Col,
  Select
} from 'antd';
import statusMappings from '../data/statusMappings.json';
import * as Moment from 'moment';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Moment(),
      className: 'G4',
      loading: true
    };
    this.setStudentStatus = this.setStudentStatus.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onDateSelect = this.onDateSelect.bind(this);
    this.sumbitAttendance = this.sumbitAttendance.bind(this);
    this.fetchStudentData = this.fetchStudentData.bind(this);
    this.submitButtonState = this.submitButtonState.bind(this);
    this.setClassName = this.setClassName.bind(this);
  }

  setStudentStatus(id, status) {
    let updated = this.state.students;
    updated[id].status = status;
    this.setState({ students: updated });
  }

  onDateSelect(date) {
    if (date) {
      this.fetchStudentData(date);
    }
  }

  fetchInfo() {
    fetch(`/info`)
      .then(res => res.json())
      .then(jsonValue => {
        this.setState({
          loading: false
        });
      })
      .catch(err => this.setState({ errors: err }));
  }

  sumbitAttendance() {
    const forDate = this.state.selectedDate.format('YYYY-DD-MM');
    this.setState({
      loading: true
    });

    fetch(`/attendance/${this.state.className}/${forDate}`, {
      method: 'POST',
      headers: {
        contentType: 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(jsonValue => {
        console.log(jsonValue);

        notification.success({
          message: 'Updated Attendance',
          description:
            'Successfully updated attendance for ' +
            (jsonValue.updatedCells - 1) +
            ' students in G4 for ' +
            this.state.selectedDate.format('YYYY-MM-DD')
        });

        this.setState({
          loading: false
        });
      })
      .catch(err => this.setState({ errors: err }));
  }

  componentDidMount() {
    this.fetchStudentData(this.state.selectedDate);
  }

  setClassName(value) {
    this.setState({
      className: value
    });
  }

  fetchStudentData(date) {
    this.setState({
      loading: true
    });
    const forDate = date.format('YYYY-DD-MM');
    fetch(`/students/${this.state.className}/${forDate}`)
      .then(res => res.json())
      .then(jsonValue => {
        console.log(jsonValue);
        this.setState({
          students: jsonValue,
          selectedDate: date,
          loading: false
        });
      })
      .catch(err => this.setState({ errors: err }));
  }

  submitButtonState() {
    if (!this.state.students) {
      return 0;
    }

    const diffCount = Object.keys(this.state.students).reduce((diff, key) => {
      return (
        diff +
        this.state.students[key].status -
        this.state.students[key].oldStatus
      );
    }, 0);

    console.log(diffCount);

    return diffCount === 0 ? 1 : 2;
  }

  render() {
    if (this.state.errors) {
      notification.error({
        message: 'Something went wrong',
        description: this.state.errors.message
      });
    }

    const submitState = this.submitButtonState();

    const cards = this.state.students
      ? Object.keys(this.state.students).map(id => {
          const student = this.state.students[id];

          return (
            <span style={{ marginRight: 24 }}>
              <Popover
                placement="top"
                title={student.name}
                content={Object.keys(statusMappings).map(statusId => {
                  const isActiveStatus = student.status == statusId;
                  return (
                    <Button
                      size="small"
                      style={{
                        borderColor: statusMappings[statusId].color,
                        color: !isActiveStatus
                          ? statusMappings[statusId].color
                          : '#FFF',
                        backgroundColor: isActiveStatus
                          ? statusMappings[statusId].color
                          : 'transparent'
                      }}
                      onClick={() => this.setStudentStatus(id, statusId)}
                    >
                      {statusMappings[statusId].description}
                    </Button>
                  );
                })}
                trigger="click"
              >
                <Badge
                  style={{
                    backgroundColor: statusMappings[student.status].color
                  }}
                  dot
                >
                  <Avatar
                    shape="square"
                    size="large"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid lightgrey',
                      color: 'black',
                      verticalAlign: 'middle'
                    }}
                  >
                    {student.shortName}
                  </Avatar>
                </Badge>
              </Popover>
            </span>
          );
        })
      : '';

    return (
      <div>
        <Row>
          <Col>
            <h1>Attendance</h1>
          </Col>
        </Row>
        <Row className="spacer">
          <Col>
            <Select
              defaultValue="G4"
              style={{ width: 120 }}
              onChange={this.setClassName}
            >
              <option value="G4">G4</option>
            </Select>
            &nbsp;
            <DatePicker
              onChange={this.onDateSelect}
              defaultValue={this.state.selectedDate}
              format={'YYYY-DD-MM'}
            />
          </Col>
        </Row>
        <Row className="spacer">
          <Col>{cards}</Col>
        </Row>
        <Row className="spacer">
          <Col>
            <Button
              loading={this.state.loading}
              type={submitState === 0 ? 'dashed' : 'primary'}
              onClick={this.sumbitAttendance}
              ghost={submitState === 1}
            >
              Submit Attendance
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Attendance;
