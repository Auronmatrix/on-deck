import React, { Component } from 'react';
import { Badge, Card, Modal, Radio } from 'antd';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: {
        '1': {
          name: 'John Doe',
          status: -1
        },
        '2': {
          name: 'Dorra Bischstrutz',
          status: -1
        },
        '3': {
          name: 'Pappa Joe',
          status: 3
        }
      }
    };

    this.setStudentStatus = this.setStudentStatus.bind(this);
  }

  setStudentStatus(id, status) {
    let updated = this.state.students;
    updated[id].status = parseInt(status);
    this.setState({ students: updated });
  }

  badgeStatus(status) {
    switch (status) {
      case 0:
        return 'success';
      case 1:
        return 'warning';
      case 2:
        return 'processing';
      case 3:
        return 'error';
    }
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

      return (
        <Card key={id} style={this.cardStyle(student.status)}>
          {student.name} &nbsp;{' '}
          <Badge status={this.badgeStatus(student.status)} />
          <Radio.Group
            size="small"
            value={student.status}
            onChange={e => this.setStudentStatus(id, e.target.value)}
          >
            <Radio.Button value="0">Here</Radio.Button>
            <Radio.Button value="1">Late</Radio.Button>
            <Radio.Button value="2">Vacation</Radio.Button>
            <Radio.Button value="3">Absent</Radio.Button>
          </Radio.Group>
        </Card>
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
