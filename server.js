    const express = require("express");
    const multer = require('multer');
    const fs = require('fs-extra')
    const app = express();
    const path = require('path');
    const { read } = require("fs");
    const port = 3000;
    const server= require('http').createServer(app)
    const io = require('socket.io')(server)

    app.set('views', './Frontend/view');
    app.set('view engine', 'pug');
    app.use(express.static('./Frontend/styles'));
    app.use(express.static('./Frontend/src'));

    // //main folder files are uploaded to
    const testFolder = './uploads/';

    const fileReading = (res) =>{
        fs.readdir(testFolder, (err, files) => {
            let lastfile = files.pop();
            let dirname = path.resolve()
            let fullfilepath = path.join(dirname, 'uploads/' + lastfile);
            return res.sendFile(fullfilepath);
            })
    }

    fileExtension = (res) =>{
        fs.readdir(testFolder, (err, files) => {
            let lastfile = files.pop();
            res.json(lastfile);
            })
    }

    const upload =  multer({
        storage: multer.diskStorage({
            destination: function(req, file, next) {
                next(null, './uploads');
                },
            filename: function (req, file, next) {
                next(null, 
                    new Date().valueOf() + 
                    '-' +
                    file.originalname);
            }
        })
    })

    app.get("/", (req, res) => {
        // res.sendFile(__dirname + '/Frontend/index.html');
        let file = "Upload File"
        res.render('index', {
            file: file
        });
    });
    
    app.post('/upload', upload.single('file'), (req, res) => {
        try {
            fileReading(res);
            res.redirect('/');
        }catch(err) {
            res.send(404);
        }
    });
    
    app.get('/uploaded/file', (req, res) =>{
        fileReading(res);
    })

    
    app.get("/uploaded/file_extension/", (req, res) =>{
        fileExtension(res)
    })

    io.on('connection', (socket) =>{
        socket.emit("img-chunk", (chunk) =>{
            //no specific file location
            var readStream = fs.createReadStream(path.resolve(__dirname, './***'), {
                encoding: 'binary'
            });
             let chunks = [];
    
            readStream.on('readable', () =>{
                console.log("image Loading...")
            })
    
            readStream.on('data', () =>{
                chunks.push(chunk);
                socket.emit('img-chunk', chunk)
            })
    
            readStream.on('end', () =>{
                console.log("image loaded");
            })

        })
    });
    
    
    server.listen(port, () => {
        console.log("listening to the port: " + port);
    });