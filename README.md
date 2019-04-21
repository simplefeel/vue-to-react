## input

```js
<template>
    <div>
        <p class="title">
            {{title}}
        </p>
        <p class="name">
            {{name}}
        </p>
    </div>

</template>

<script>
export default {
	data() {
		return {
			show: true,
			name: 'name',
		};
	},
};
</script>
```

## output

```js
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
```
