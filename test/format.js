export default class myComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: true,
			name: 'name',
		};
	}
	render() {
		return (
			<div>
				<p className="title">{title}</p>

				<p className="name">{name}</p>
			</div>
		);
	}
}
