ffmpeg = require('fluent-ffmpeg');
const path = require('path');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    let mp4 = path.join(__dirname, '../public', 'video.mp4')
    let mp3 = path.join(__dirname, '../public', 'song.mp3')


    ffmpeg(mp4)
        .toFormat('mp3')
        .on('error', (err) => {
            console.log('An error occurred: ' + err.message);
        })
        .on('progress', (progress) => {
            // console.log(JSON.stringify(progress));
            console.log('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', () => {
            console.log('Processing finished !');
        })
        .save(mp3); //path where you want to save your file
});

module.exports = router;