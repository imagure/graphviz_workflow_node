const http = require('http');
const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs')

graphViz = require('./graph_controller').GraphVizController;

const gv = new graphViz();
const dir = path.join(__dirname);
const app = new Koa();

app.use(router.routes())
app.use(koaBody())

// Settings
const HOST = 'localhost';
const HTTP_PORT = 3000;

// initial GET test
router.get('/', function(ctx, next) {
	const reqpath = ctx.url.toString().split('?')[0];
	const file = path.join(dir, reqpath.replace(/\/$/, '/output.png'));
	ctx.type = 'image/png';
	ctx.body = fs.createReadStream(file);
	ctx.status = 200
});

// POST com workflows (arrumar retorno do png)
router.post('/', koaBody(), function(ctx, next) {
	if (!ctx.request.body){
		ctx.body = "No Blueprint was sent!";
		ctx.status = 404;
		return
   }
	next()

	const reqpath = ctx.url.toString().split('?')[0];
	var file;
	console.log(file)
	while (!file) {
		file = path.join(dir, reqpath.replace(/\/$/, ctx.body));	
	} 
	ctx.type = 'image/png';
	ctx.body = fs.createReadStream(file);
});

router.post('/', function(ctx, next) {
	next()
	if (!ctx.body){
		return "output"
	}
	ctx.body = '/' + ctx.body + '.png'
});

router.post('/', function(ctx, next) {
	ctx.body = gv.build_graph(ctx.request.body)
});

// Listen
const httpServer = http.createServer(app.callback())
  .listen(HTTP_PORT, HOST)
