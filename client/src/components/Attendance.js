import React, { Component } from 'react';
import { Badge, Button, Avatar, Popover, notification } from 'antd';
import statusMappings from '../data/statusMappings.json';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setStudentStatus = this.setStudentStatus.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  setStudentStatus(id, status) {
    let updated = this.state.students;
    updated[id].status = status;
    this.setState({ students: updated });
  }

  componentDidMount() {
    fetch('/students/G4a')
      .then(res => res.json())
      .then(jsonValue => this.setState({ students: jsonValue }))
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
                title={student.firstname + ' ' + student.lastname}
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
                    {student.firstname} {student.lastname[0]}
                  </Avatar>
                </Badge>
              </Popover>
            </span>
          );
        })
      : '';

    return (
      <div>
        <h1>Attendance</h1>
        {cards}
      </div>
    );
  }
}

export default Attendance;
