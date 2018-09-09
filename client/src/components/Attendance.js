import React, { Component } from 'react';
import {
  Badge,
  Button,
  Avatar,
  Popover,
  notification,
  DatePicker,
  Row,
  Col
} from 'antd';
import statusMappings from '../data/statusMappings.json';
import * as Moment from 'moment';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Moment()
    };
    this.setStudentStatus = this.setStudentStatus.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onDateSelect = this.onDateSelect.bind(this);
    this.sumbitAttendance = this.sumbitAttendance.bind(this);
    this.fetchStudentData = this.fetchStudentData.bind(this);
  }

  setStudentStatus(id, status) {
    let updated = this.state.students;
    updated[id].status = status;
    this.setState({ students: updated });
  }

  onDateSelect(date) {
    this.fetchStudentData(date);
  }

  sumbitAttendance() {
    const forDate = this.state.selectedDate.format('YYYY-DD-MM');
    fetch('/attendance/G4/' + forDate, {
      method: 'POST',
      headers: {
        contentType: 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(jsonValue => {
        console.log(jsonValue);
        this.setState({ students: this.studentNamesToMap(jsonValue) });
      })
      .catch(err => this.setState({ errors: err }));
  }

  componentDidMount() {
    this.fetchStudentData(this.state.selectedDate);
  }

  fetchStudentData(date) {
    const forDate = date.format('YYYY-DD-MM');
    fetch('/students/G4/' + forDate)
      .then(res => res.json())
      .then(jsonValue => {
        console.log(jsonValue);
        this.setState({ students: jsonValue, selectedDate: date });
      })
      .catch(err => this.setState({ errors: err }));
  }

  render() {
    if (this.state.errors) {
      notification.error({
        message: 'Something went wrong',
        description: this.state.errors.message
      });
    }
    const cards = this.state.students
      ? Object.keys(this.state.students).map(id => {
          const student = this.state.students[id];

          return (
            <span style={{ marginRight: 24 }}>
              <Popover
                placement="top"
                title={student.name}
                content={Object.keys(statusMappings).map(statusId => (
                  <Button
                    size="small"
                    style={{ borderColor: statusMappings[statusId].color }}
                    onClick={() => this.setStudentStatus(id, statusId)}
                  >
                    {statusMappings[statusId].description}
                  </Button>
                ))}
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
        <Row>
          <Col>
            <DatePicker
              onChange={this.onDateSelect}
              defaultValue={this.state.selectedDate}
              format={'YYYY-DD-MM'}
            />
          </Col>
        </Row>
        <Row>
          <Col>{cards}</Col>
        </Row>
        <Row>
          <Col>
            <Button type="primary" onClick={this.sumbitAttendance}>
              Submit Attendance
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Attendance;
