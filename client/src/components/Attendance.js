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
  Select,
  Icon
} from 'antd';
import statusMappings from '../data/statusMappings.json';
import * as Moment from 'moment';
import Loader from './Loader';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Moment(),
      className: 'G3',
      loading: true,
      dateExists: false
    };
    this.setStudentStatus = this.setStudentStatus.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onDateSelect = this.onDateSelect.bind(this);
    this.sumbitAttendance = this.sumbitAttendance.bind(this);
    this.fetchStudentData = this.fetchStudentData.bind(this);
    this.hasStudentStatesChanged = this.hasStudentStatesChanged.bind(this);
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
    this.setState(
      {
        className: value,
        students: undefined
      },
      () => this.fetchStudentData(this.state.selectedDate)
    );
  }

  fetchStudentData(date) {
    this.setState({
      loading: true
    });

    const forDate = date.format('YYYY-DD-MM');
    fetch(`/students/${this.state.className}/${forDate}`)
      .then(res => res.json())
      .then(jsonValue => {
        this.setState({
          dateExists: jsonValue.dateExists,
          dateRow: jsonValue.dateRow,
          students: jsonValue.students,
          selectedDate: date,
          loading: false
        });
      })
      .catch(err => this.setState({ errors: err }));
  }

  hasStudentStatesChanged() {
    if (!this.state.students) {
      return false;
    }

    return Object.keys(this.state.students).some(key => {
      return (
        this.state.students[key].status !== this.state.students[key].oldStatus
      );
    });
  }

  render() {
    if (this.state.errors) {
      notification.error({
        message: 'Something went wrong',
        description: this.state.errors.message
      });
    }

    const updateRequired =
      !this.state.dateExists || this.hasStudentStatesChanged();

    const cards = this.state.students
      ? Object.keys(this.state.students).map(id => {
          const student = this.state.students[id];
          const studenHasStatus = student.status >= 0;

          return (
            <span>
              <Popover
                placement="bottom"
                title={student.name}
                content={Object.keys(statusMappings).map(statusId => {
                  const isActiveStatus = student.status == statusId;
                  return (
                    <Button
                      size="small"
                      className="set-status-btn"
                      style={{
                        borderColor: studenHasStatus
                          ? statusMappings[statusId].color
                          : 'lightgrey',
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
                  className="student-badge"
                  count={student.status}
                  style={{
                    backgroundColor: studenHasStatus
                      ? statusMappings[student.status].color
                      : 'lightgrey',
                    color: '#fff'
                  }}
                >
                  <Avatar
                    className="student-avatar"
                    shape="square"
                    size="large"
                    style={{
                      borderColor: studenHasStatus
                        ? statusMappings[student.status].color
                        : 'lightgrey'
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
        <Row className="spacer">
          <Col>
            <h2>Class Attendance ({this.state.className})</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              defaultValue="G3"
              style={{ width: 120 }}
              onChange={this.setClassName}
            >
              <Select.Option value="G1">G1</Select.Option>
              <Select.Option value="G3">G3</Select.Option>
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
          {this.state.loading ? (
            <Loader loading={this.state.loading} />
          ) : (
            <Col>{cards}</Col>
          )}
        </Row>
        <Row className="spacer">
          <Col>
            <Button
              loading={this.state.loading}
              type={updateRequired ? 'primary' : 'dashed'}
              onClick={this.sumbitAttendance}
              icon={updateRequired ? 'save' : 'check'}
              disabled={!updateRequired}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Attendance;
