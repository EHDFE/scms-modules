let webpack = require('webpack');
let path = require('path');
let ManifestPlugin = require('webpack-manifest-plugin');

//
let HtmlWebpackPlugin = require('html-webpack-plugin');

//处理css的loader、plugins
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let autoprefixer = require('autoprefixer');

//css分文件
let appCss = new ExtractTextPlugin('app_[name]_[id].css');
let lessCss = new ExtractTextPlugin('less_[name]_[id].css');
module.exports = {
    //devtool: 'inline-source-map',
    devtool: 'source-map',
    entry:  {
        
        //scmsModules: "scmsmodules",
        app: __dirname + '/node_modules/scmsmodules-runner/app/main.js',
        //bootstrapCss: "./node_modules/bootstrap/less/bootstrap.less"
    },//已多次提及的唯一入口文件
    output: {
      path: __dirname + "/docs",//打包后的文件存放的地方
      filename: "[name].bundle.js",
      chunkFilename: "[name]_[id].chunk.js"
    },
    devServer: {
        contentBase: "./node_modules/scmsmodules-runner/public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    resolve: {
        alias: {
            'scmsModules': path.join(__dirname,'./src/'),
            'scmsmodules': path.join(__dirname,'./')
        }
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /(\.jsx|\.js)$/,
                        use: {
                            loader: "babel-loader",
                            options: {
                                babelrc: false,
                                presets: [
                                    [
                                        require.resolve('babel-preset-env'),
                                        {
                                            targets: {
                                                browsers: ['last 2 versions']
                                            },
                                            module: false,
                                            useBuiltIns:true
                                        }
                                    ],                            
                                    require.resolve('babel-preset-stage-1')
                                ],
                                cacheDirectory: true
                            }
                        }//,
                        //exclude: /node_modules/
                    },
                    {
                        test: /\.css$/,
                        use: appCss.extract({
                            fallback: "style-loader",
                            use: [{
                                loader: "css-loader"
                            }, {
                                loader: "postcss-loader",
                                options: {
                                    ident: 'postcss',
                                    plugins: (loader) => [
                                        autoprefixer()
                                    ]
                                }
                            }],
                        })
                    },            
                    
                    {
                        test: /\.less$/,
                        use: lessCss.extract({
                            fallback: "style-loader",
                            use: [{
                                loader: "css-loader"
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    ident: 'postcss',
                                    plugins: (loader) => [
                                        autoprefixer()
                                    ]
                                }
                            },
                            {
                                loader: "less-loader"
                            }]
                        })
                    },
                    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
                    { test: /\.(woff|woff2)$/, loader:"url-loader?prefix=font/&limit=5000" },
                    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
                    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
                    {  
                        test: /\.jpeg$/,  
                        use: 'url-loader?limit=1024',  
                    },
                    {  
                        test: /\.png$/,  
                        use: 'url-loader?limit=1024',  
                    },
                    {  
                        test: /\.gif$/,  
                        use: 'url-loader?limit=1024',  
                    },
                    {
                        resourceQuery: {
                        include: /\?asFile/,
                        },
                        loader: require.resolve('file-loader'),
                        options: {
                        name: '[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: /\.html$/,
                        use: [
                            {
                                loader: 'html-loader',
                                options: {
                                    ignoreCustomFragments: [/\{\{.*?}}/],
                                    interpolate: true,
                                    root: './node_modules/scmsmodules-runner/',
                                }
                            },
                            {
                                loader: require.resolve('posthtml-loader'),
                            }
                        ],
                        exclude: /\/app\/index\.html/
                    }
                ]
            }  
        ]
    },
    plugins: [
        appCss,
        lessCss,
        //new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedModulesPlugin(),
        new ManifestPlugin(),
        new HtmlWebpackPlugin({
            template: './node_modules/scmsmodules-runner/app/index.html'
        })
    ]
}