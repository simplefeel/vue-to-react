import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class MyReactCompoennt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      name: 'name'
    };
  }
  static propTypes = { title: PropTypes.string };
  static defaultProps = { title: 'title' };
  componentDidMount() {
    console.log(this.state.name);
  }
  handleClick() {}
  render() {
    return (
      <div>
        <p className="title" onClick={this.handleClick}>
          {this.props.title}
        </p>

        {this.state.show ? <p className="name">{this.state.name}</p> : null}
      </div>
    );
  }
}
