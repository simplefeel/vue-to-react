const parse = require('@babel/parser').parse;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const compiler = require('vue-template-compiler');

exports.splitSFC = function(source, isSFC) {
	if (isSFC) {
		const res = compiler.parseComponent(source);
		return {
			template: res.template.content.replace(/{{/g, '{').replace(/}}/g, '}'),

			js: res.script.content.replace(/\/\//g, '').replace(/\\n+/g, ''),
		};
	} else {
		return {
			template: null,
			js: source,
		};
	}
};

exports.traverseTemplate = function traverseTemplate(template, state) {
	let argument = null;
	const template_ast = parse(template, {
		sourceType: 'module',
		plugins: ['jsx'],
	});

	traverse(template_ast, {
		ExpressionStatement: {
			enter(path) {},
			exit(path) {
				argument = path.node.expression;
			},
		},

		JSXAttribute(path) {
			const node = path.node;
			const value = node.value.value;
			if (!node.name) {
				return;
			}
			if (node.name.name === 'class') {
				path.replaceWith(t.jSXAttribute(t.jSXIdentifier('className'), node.value));
				return;
			}
		},
	});

	return argument;
};

exports.traverseScript = function(js, state) {
	const vast = parse(js, {
		sourceType: 'module',
	});

	traverse(vast, {
		ObjectMethod(path) {
			const parent = path.parentPath.parent;
			const name = path.node.key.name;

			if (parent && t.isExportDefaultDeclaration(parent)) {
				if (name === 'data') {
					const body = path.node.body.body;
					state.data['_statements'] = [].concat(body);

					let propNodes = {};
					body.forEach(node => {
						if (t.isReturnStatement(node)) {
							propNodes = node.argument.properties;
						}
					});

					propNodes.forEach(propNode => {
						state.data[propNode.key.name] = propNode.value;
					});
					path.stop();
				}
			}
		},
	});
};

exports.genConstructor = function genConstructor(path, state) {
	const nodeLists = path.node.body;
	const blocks = [t.expressionStatement(t.callExpression(t.super(), [t.identifier('props')]))];
	if (state.data['_statements']) {
		state.data['_statements'].forEach(node => {
			if (t.isReturnStatement(node)) {
				const props = node.argument.properties;
				// supports init data property with props property
				props.forEach(n => {
					if (t.isMemberExpression(n.value)) {
						n.value = t.memberExpression(t.identifier('props'), t.identifier(n.value.property.name));
					}
				});

				blocks.push(
					t.expressionStatement(
						t.assignmentExpression(
							'=',
							t.memberExpression(t.thisExpression(), t.identifier('state')),
							node.argument
						)
					)
				);
			} else {
				blocks.push(node);
			}
		});
	}
	const ctro = t.classMethod(
		'constructor',
		t.identifier('constructor'),
		[t.identifier('props')],
		t.blockStatement(blocks)
	);
	nodeLists.push(ctro);
};

exports.genSFCRenderMethod = function genSFCRenderMethod(path, node, argument) {
	let blocks = [];
	blocks = blocks.concat(t.returnStatement(argument));
	const render = t.classMethod('method', t.identifier('render'), [], t.blockStatement(blocks));
	path.node.body.push(render);
};
