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

// add babel target
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
		plugins: [
			(compiler) => {
				compiler.hooks.beforeRun.tap("beforeRunCB", () => {					
					buildFiles();
				});
			},
			/*
			new webpack.ProvidePlugin({React: 'react'}),
			new webpack.ProvidePlugin({Link: ['raviger', 'Link']})
			*/
		],
		optimization: {
			usedExports: true
		},
		devServer: {
     		hot: true,
			historyApiFallback: {index: '404.html'},
			client: { logging: 'warn'},
			onBeforeSetupMiddleware: (server)=>{
				buildFiles();
    		}
    	},
		module: {
			rules: [
			    {
				    test: /\.m?js$/,
				    exclude: /(node_modules)/,
				    use: {
				        loader: "babel-loader",
				        options: {
				        	presets: ["@babel/preset-env", "@babel/preset-react"]
				        }
					}
			    },
				{
				    test: /\.s[c]ss$/,
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
 		obj.optimization.minimizer = [new TerserPlugin()];
 	}else{
 		obj.devtool = "eval-cheap-source-map";
 	}
 	return obj;
}