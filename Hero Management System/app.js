
const path = require('path')
const db = require(path.join(__dirname, './utils/db'))
var bodyParser = require('body-parser')
const express = require('express')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const app = express()

app.use(express.static('./www'))
app.use(express.static('./uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
//设置允许跨域请求
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

//登录接口 /login post username password
app.post('/login', function (req, res) {
    const username = req.body.username
    const password = req.body.password
    if (username == 'admin' && password == '123456') {
        res.send({
            msg: '成功',
            code: 200
        })
    } else {
        res.send({
            msg: '失败',
            code: 400
        })
    }

})

//英雄列表 /list get 无参
app.get('/list', function (req, res) {
    const data = db.getHeros()
    res.send({
        msg: '获取成功',
        code: 200,
        data
    })
})

//新增英雄 /add post name skill有参数 有文件icon
app.post('/add', upload.single('icon'), function (req, res, next) {
    const icon = req.file.path
    const { name, skill } = req.body
    if (db.addHero({ name, skill, icon })) {
        res.send({
            msg: "新增成功",
            code: 200
        })
    } else {
        res.send({
            msg: "参数错误",
            code: 400,
        })
    }

})

//英雄删除 /delete get 参数id
app.get('/delete', function (req, res) {
    // console.log(req.query.id);
    if (db.deleteHeroById(req.query.id)) {
        res.send({
            msg: '删除成功',
            code: 200
        })
    } else {
        res.send({
            msg: '参数错误',
            code: 400
        })
    }
})

//英雄查询 /search get 参数id
app.get('/search', function (req, res) {
    console.log(req.query.id);
    if (db.getHeroById(req.query.id)) {
        res.send({
            msg: '查询成功',
            code: 200,
            data: db.getHeroById(req.query.id)
        })
    } else {
        res.send({
            msg: '参数错误',
            code: 400
        })
    }
})

//英雄编辑 /edit post 参数id name skill icon
app.post('/edit', upload.single('icon'), function (req, res, next) {
    const icon = req.file.path
    const { name, skill, id } = req.body
    if (db.editHero({ icon, name, skill, id })) {
        res.send({
            msg: '修改成功',
            code: 200
        })
    } else {
        res.send({
            msg: '参数错误',
            code: 400
        })
    }
})


app.listen(3000, () => {
    console.log('success');

})