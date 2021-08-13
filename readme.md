>>Set UP

## 1. setup a static folder server.js

```js
app.use('/static', express.static('uploads'))
//url: http://localhost:2727/static/0f8f54c1-9e96-4ec7-97b4-f7d2d1a44d8e-1628847597838.jpg

```


## 2. create a file called Uplaoder.js
```js
const multer = require('multer')
const path = require('path')


/**
 * config multer
 */

const UPLOAD_DESTINATION = './uploads/'
let Uploader = multer({
    // //where to upload
    // dest: uploadFolder,
    //file size limit
    limits: {
        fileSize: 1024 * 1024 * 5,//5mb(koto byte)
    },
    fileFilter: (req, file, cb) => {
        /**
         * file{
         *  fieldname:"img",->html filed name
         *  originalname:"abac.png",
         *  encoding:"",
         *  mimetype:"image/png"
         * }
         * 
         * AXIOS setup
         * 
         * 
         * 
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

module.exports = Uploader

```


## 3. use the uplaoder in route

```js
const Uploader = require('./Uploader')

//here img = Form Data field name
router.post('/create-file', Uploader.single('img'), async (req, res) => {
    try {

        //get data from body
        const file = req.file //{}
        const { pid, title, url } = req.body
        if (!Helper.validateField(pid, title)) {
            throw new Error("Enter Page id,File title")
        }
        const url = "http://localhost:2727/static/" + file.filename

        //create a page
        const file = await File.create({ pid, title, url })

        res.send(Response(false, "success", file.toJSON()))
    } catch (error) {
        res.send(Response(true, error.message, false))
    }
})

```


## 4. Front End Html

```html

<h1>upload single file with title with axios</h1>
<form id="form" method="POST">
    <input type="file" name="img" id="img">
    <input type="text" name="title" id="title">
    <input type="submit" value="Upload File">
</form>

```

## 5. Front End Axios

```js
const form = document.getElementById("form")
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const img = document.getElementById("img")
    const title = document.getElementById("title")

    if (img.files.length == 0) {
        document.write("Select one or more files.")
    } else {

        const ob = new FormData()
        ob.append('img', img.files[0], img.files[0].name)
        ob.append('title', title.value)

        axios.defaults.baseURL = 'http://localhost:2727/';

        axios.post('upload', ob).then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        })
    }
})

```