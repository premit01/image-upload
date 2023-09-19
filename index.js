const express = require('express');
require('dotenv').config();
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk')
const app = express();
const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors())

function getContentType(fileExtension) {
    switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        // Add more cases for other file types as needed
        default:
            return 'application/octet-stream'; // Default to binary data if content type is unknown
    }
}





const accessKeyId = 'XF6FX1MORFDQ8CAI8MS6';
const secretAccessKey = 'MXgDefv2VJszEkDe6Mzfe233h0n0DfFD7XSZWkUm';


const s3 = new AWS.S3({
    region: 'us-west-1',
    accessKeyId,
    secretAccessKey,
    endpoint: 's3.wasabisys.com',
});

const storage = multerS3({
    s3,
    bucket: 'user-uploaded-images',
    acl: 'public-read',
    key: (req, file, cb) => {
        const uniqueFolderName = 'habibur03';
        if (!uniqueFolderName) {
            return cb(new Error('User ID not provided'));
        }
        const key = `${uniqueFolderName}/${file.originalname}`;
        cb(null, key)
    }
})


const upload = multer({ storage }).array('images');

app.post('/upload', (req, res) => {


    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        // Images uploaded successfully
        res.send('image upload successful')
    });

});


// single upload  and get url
const singleUpload = multer({ storage });
app.post('/singleUpload', singleUpload.single('singleImage'), (req, res) => {

    res.send(req.file?.location)
})







app.get('/', (req, res) => {
    res.send({ message: 'hello world' })
})

app.listen(port, () => console.log('running port is', port))