import React, { Component } from 'react';
import { Badge, Card, Button, Row, Col, Avatar, Popover } from 'antd';
import testStudents from '../data/students.json';
import statusMappings from '../data/statusMappings.json';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: testStudents
    };

    this.setStudentStatus = this.setStudentStatus.bind(this);
  }

  setStudentStatus(id, status) {
    let updated = this.state.students;

    console.log(id + ' and ' + status);
    updated[id].status = status;
    this.setState({ students: updated });
  }

  cardStyle(status) {
    switch (status) {
      case -1:
        return {
          'border-color': '#1890ff',
          width: 300,
          'margin-bottom': '5px'
        };
      default:
        return { width: 300, 'margin-bottom': '5px' };
    }
  }

  render() {
    const cards = Object.keys(this.state.students).map(id => {
      const student = this.state.students[id];

      const popOverContent = Object.keys(statusMappings).map(statusId => (
        <Button
          size="small"
          style={{ 'border-color': statusMappings[statusId].color }}
          onClick={() => this.setStudentStatus(id, statusId)}
        >
          {statusMappings[statusId].description}
        </Button>
      ));

      return (
        <span style={{ marginRight: 24 }}>
          <Popover
            placement="top"
            title={student.firstname + ' ' + student.lastname}
            content={popOverContent}
            trigger="click"
          >
            <Badge
              style={{ backgroundColor: statusMappings[student.status].color }}
              //className="happy-badge"
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
    });

    return (
      <div>
        <h1>Attendance</h1>
        {cards}
      </div>
    );
  }
}

export default Attendance;
