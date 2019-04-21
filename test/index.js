const parse = require('@babel/parser').parse;
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const { traverseTemplate, traverseScript, splitSFC, genConstructor, genSFCRenderMethod } = require('../src/index.js');

const sfc = require('./index.vue');

const state = {
	name: undefined,
	data: {},
	props: {},
	computeds: {},
	components: {},
};

// 分割 .vue 单文件(SFC)
const parseCode = splitSFC(sfc.file, true);

// traverse template
const renderArgument = traverseTemplate(parseCode.template);

console.log(parseCode);

// traverse script
traverseScript(parseCode.js, state);

// vue --> react
const tpl = `export default class myComponent extends Component {}`;

// 编译ast
const rast = parse(tpl, {
	sourceType: 'module',
});
// 转换ast
traverse(rast, {
	ClassBody(path) {
		genConstructor(path, state);
		genSFCRenderMethod(path, state, renderArgument);
	},
});
// 重新生成ast
const { code } = generate(rast, {
	quotes: 'single',
	retainLines: true,
});

// 转化后的代码
console.log(code);
