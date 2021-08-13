const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')

const cors = require('cors')



app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/static', express.static('uploads'))
//url: http://localhost:2727/static/0f8f54c1-9e96-4ec7-97b4-f7d2d1a44d8e-1628847597838.jpg

/**
 * config multer
 */

const UPLOAD_DESTINATION = './uploads/'
let uploader = multer({
    // //where to upload
    // dest: uploadFolder,
    //file size limit
    limits: {
        fileSize: 1024 * 1024 * 2,//2mb(koto byte)
    },
    fileFilter: (req, file, cb) => {
        /**
         * file{
         *  fieldname:"img",->html filed name
         *  originalname:"abac.png",
         *  encoding:"",
         *  mimetype:"image/png"
         * }
         */
        if (file.fieldname === 'img') {//only for img filed
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                cb(null, true)
            } else {
                cb(new Error("file type not suppported"), false)
            }
        } else {
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                cb(null, true)
            } else {
                cb(new Error("file type not suppported"), false)
            }
        }

    },//fileFilter
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOAD_DESTINATION)
        },
        filename: (req, file, cb) => {
            const extention = path.extname(file.originalname)
            const file_name = file.originalname.replace(extention, "").toLowerCase().split(" ").join("-") + "-" + Date.now() + extention
            cb(null, file_name)
        }
    })
})
//end basic desination+file size+file filter



/**
 * routers
 */

//uplader.single("img")->img= form field name
app.post('/test', uploader.single("parts_img"), (req, res) => {
    const file = req.file //{}
    console.log(file);
    console.log(req.body);
    res.json({ res: `${req.body} is uploaded.` })
})





//uplader.single("img")->img= form field name
app.post('/upload', uploader.single("img"), (req, res) => {
    const file = req.file //{}
    console.log(file);
    console.log(req.body.title);
    console.log("url- http://localhost:2727/static/" + file.filename);
    res.json({ res: `${req.body.title} is uploaded.` })
})

//uploader.array("img", 3)->img= form field name, 3= max file number
app.post('/upload-m', uploader.array("img", 3), (req, res) => {
    const files = req.files //[]

    res.send("upload finished")
})

//uploader.fields([])->(img= form field name, 3= max file number )[]
app.post('/upload-field', uploader.fields([
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 }
]), (req, res) => {
    res.send("upload finished")
})

app.listen(2727, () => {
    console.log(`runinng on 2727`);
})