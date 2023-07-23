const { Component } = require("react");



export default class MenuItem extends Component {
    constructor(props) {
        super(props);
      }
      
    render() {
        return (
            <div style={{width:'96%', minHeight: '15vh', borderStyle:'solid', marginLeft: '2vw', marginRight: '2vw'}}>
                {`Name:${this.props.name || ''}  Collected: ${this.props.collected || ''}`}
            </div>

        )
    };
}
export { MenuItem };