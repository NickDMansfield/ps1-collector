const { button, Component } = require("react");



export default class MenuItem extends Component {
      
    constructor(props) {
        console.log(props.game);
        super(props);
      }
    render() {
        return (
            <div onClick={() => this.props.selectItemFunction(this.props.game)} style={{ display:'flex', justifyContent:'space-between', flexDirection: 'row', minHeight: '15vh', borderStyle:'solid', marginLeft: '2vw', marginRight: '2vw'}}>
                <div style={{backgroundColor: this.props.game.collected ? '#00ff00' : '#ff0000', display:'flex', flexBasis: 1, minWidth:'10vw' }}>
                </div>
            <div style={{display:'flex', width:'100%', backgroundColor: 'grey' }}>
            {`Name:${this.props.game.name || ''}`}
            </div>
            </div>
        )
    };
}
export { MenuItem };