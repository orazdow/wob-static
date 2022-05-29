const webpack = require('webpack');
const path = require( 'path' );
const TerserPlugin = require('terser-webpack-plugin');
const buildRoutes = require("./scripts/build-routes");
const buildLists = require("./scripts/build-lists");
const baseroute = path.resolve('src/site');

async function buildFiles(){
	await buildLists(baseroute);
	await buildRoutes(baseroute);
}

module.exports = (env, argv)=>{
 	let obj = {
		entry: {
			main: "./src/app.js"
		},
		output: {
			path: path.resolve('./public'),
			publicPath: '',
			filename: "main.js"
		},
		mode: argv.mode,
		target: ['web', 'es6'],
		plugins: [
			(compiler) => {
				compiler.hooks.beforeRun.tap("beforeRunCB", () => {	
					if(!env.nobuild) buildFiles();					
				});
			},
			// new webpack.ProvidePlugin({React: 'react'}),
			// new webpack.ProvidePlugin({Link: ['raviger', 'Link']})
		],
		optimization: {
			usedExports: true
		},
		devServer: {
     		hot: true,
			historyApiFallback: {index: '404.html'},
			client: { logging: 'warn'},
   			setupMiddlewares: (middlewares, devServer) =>{
   				if(!env.nobuild) buildFiles();
   				return middlewares;
   			}
    	},
		module: {
			rules: [
			    {
				    test: /\.m?js$/,
				    exclude: /(node_modules)/,
				    use: [{
				        loader: "babel-loader",
				        options: {
				        	presets: [
				        	["@babel/preset-env",
				        	{targets: {node: 16}}], 
				        	"@babel/preset-react"
				        	]
				        }
					},
					path.resolve('./scripts/css2json.js')]
			    },

				{
				    test: /\.s?css$/,
				    use: ['style-loader', 'css-loader', 'sass-loader']
				},
				
				{
					test: /\.mdx?$/,
		        	use: [
		        		{
			        		loader: '@mdx-js/loader',
			        		options: {
			        			mdxExtensions: ['.md'],
			        			format: 'mdx'
			        		}
		        		},
		        			path.resolve('./scripts/css2json.js'),
		        		{
		        			loader: path.resolve('./scripts/addimport.js'),
		        			options: {		        			
	        					module: 'Link',
	        					source: 'raviger',
	        					named: true,
	        					enabled: true
		        			}
		        		}
		        	]
				}
			]
		} 		
 	};

 	if(argv.mode === 'production'){
 		obj.optimization.minimize = true;
 		obj.optimization.minimizer = [new TerserPlugin({
      	extractComments: false,
      	terserOptions: {format: {comments: false}},
    })];
 	}else{
 		obj.devtool = "eval-cheap-source-map";
 	}
 	return obj;
}