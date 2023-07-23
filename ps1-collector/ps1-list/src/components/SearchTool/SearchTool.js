import React, { Component } from 'react';

export default class SearchTool extends Component {
  constructor(props) {
    console.log(props.game);
    super(props);
    this.state = {
      searchBarExpanded: false,
      searchText: '',
    };
  }

  render() {
    return (
      <div>
        <div>
            {
                this.state.searchBarExpanded ? 
                (
                    <input
                      type="text"
                      value={this.state.searchText}
                      placeholder="useless placeholder"
                      onChange={(e) => {
                          this.setState({ searchText: e.target.value });
                          this.props.textChangedSetter(e.target.value);
                      }}
                    />)
                : ''
            }
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end'}} onClick={() => {
          this.setState({ searchBarExpanded: !this.state.searchBarExpanded, searchText: '' });
          this.props.textChangedSetter('');

        } }>???</div>
      </div>
    );
  }
}

export { SearchTool };