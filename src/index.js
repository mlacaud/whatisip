
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const pathFolder = path.join(__dirname, 'json');
const pathIp = path.join(pathFolder, 'ip.json')

function readJson(path) {
    var data,
        obj = {};
    if (fs.existsSync(path)) {
        data = fs.readFileSync(path, 'utf8');
        obj = JSON.parse(data);
    }

    return obj;
}

function createPathIfNotExist(path1) {
    var pathTable = path1.split(path.sep);
    var currentPath = pathTable[1];
    for (var i = 0; i < pathTable.length; i++) {
        if (i > 0)
            currentPath += path.sep + pathTable[i];
        if (!fs.existsSync(currentPath))
            fs.mkdirSync(currentPath);
    }
}

function writeJson(path, obj) {
    var json = JSON.stringify(obj);
    fs.writeFileSync(path, json);
}

function save_address(key, value) {
    createPathIfNotExist(pathFolder);

    var data = readJson(pathIp);
    data[key] = {
        ip: value,
        update: new Date()
    };
    writeJson(pathIp, data);
}

app.get('/', function (req, res) {
    var data = readJson(pathIp);
    if (data) {
        res.send(data);
    } else {
        res.sendStatus(404);
    }
})

app.post('/:pc', function (req, res) {
    var pc = req.params.pc;
    var ip = req.ip;
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
        }
    save_address(pc, ip);
    res.send({pc:ip});
})

app.delete('/:pc', function (req, res) {
    var pc = req.params.pc;
    var data = readJson(pathIp);
    if (data[pc]) {
        delete data[pc];
        writeJson(pathIp, data);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.delete('/', function (req, res) {
    var pc = req.params.pc;
    var data = {};
    writeJson(pathIp, data);
    res.sendStatus(200);
})

app.listen(3000, function () {
    console.log('Listening on port 3000')
})