const webpack = require('webpack');
const path = require( 'path' );
const TerserPlugin = require('terser-webpack-plugin');
const rehypeWrap = require('rehype-wrap');
const baseroute = path.resolve('src/site');
const buildRoutes = require("./scripts/build-routes");
const buildLists = require("./scripts/build-lists");

async function buildFiles(){
    await buildLists(baseroute);
    await buildRoutes(baseroute);
}

module.exports = async (env, argv)=>{
    if(!env.nobuild) await buildFiles();
    let obj = {
        entry: {
            main: "./src/app.js"
        },
        output: {
            path: path.resolve('./public'),
            publicPath: '',
            filename: "bundle.js"
        },
        mode: argv.mode,
        target: ['web', 'es6'],
        plugins: [
            // new webpack.ProvidePlugin({React: 'react'}),
            // new webpack.ProvidePlugin({Link: ['raviger', 'Link']})
        ],
        optimization: {
            usedExports: true
        },
        devServer: {
            historyApiFallback: {index: '404.html'},
            client: { logging: 'warn'}
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                ["@babel/preset-env", {targets: {node: 16}}], 
                                "@babel/preset-react"
                            ]
                        }
                    }
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
                                format: 'mdx',
                                rehypePlugins: [[rehypeWrap, {
                                    wrapper: '.markdown-content',
                                }]]
                            }
                        },
                            path.resolve('./scripts/html2jsx.js'),
                        {
                            loader: path.resolve('./scripts/addimport.js'),
                            options: {                          
                                module: 'Link',
                                source: 'raviger',
                                named: true,
                                enabled: true,
                                test: /<\s*?Link/gm
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