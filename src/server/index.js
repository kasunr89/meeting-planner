import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.config.js';

const app = express(),
    compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
    // publicPath: config.output.publicPath
}))
// app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
});
