const { button, Component } = require("react");



export default class MenuItem extends Component {
      
    constructor(props) {
        console.log(props.game);
        super(props);
      }
    render() {
        return (
            <div onClick={() => this.props.selectItemFunction(this.props.game)} style={{ backgroundColor: this.props.game.collected ? '#00ff00' : '#ff0000', minHeight: '15vh', borderStyle:'solid', marginLeft: '2vw', marginRight: '2vw'}}>
                {`Name:${this.props.game.name || ''}  Collected: ${this.props.game.collected}`}
            </div>
        )
    };
}
export { MenuItem };