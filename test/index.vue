module.exports = {
    file:`<template>

    <div>

        <p class="title">
            {{title}}
        </p>

        <p class="name">
            {{name}}
        </p>

    </div>

</template>

<style>
.title {
	font-size: 28px;
	color: #333;
}

.name {
	font-size: 32px;
	color: #999;
}
</style>

<script>
export default {
	data() {
		return {
			show: true,
			name: 'name',
		};
	},
};
</script>`
}