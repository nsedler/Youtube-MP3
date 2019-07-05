var express = require('express');
var router = express.Router();

const path = require('path');

ffmpeg = require('fluent-ffmpeg');

require('dotenv').config()

const fs = require('fs');
const ytdl = require('ytdl-core');
const {
	getInfo
} = require('ytdl-getinfo')

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.TOKEN);

/**
 * @name search
 * 
 * @param {String} song - Any youtube link or query
 * 
 * @purpose Convert any youtube video into mp3
 */
router.get('/', function (req, res, next) {
	let query = req.query.song;
	let file = path.join(__dirname, '../public', 'video.mp4')

	var title;
	var duration;

	if (query.includes('youtube.com')) {
		ytdl(query)
			.pipe(fs.createWriteStream(file));

		console.log(query);
	} else {
		youtube.searchVideos(req.query.song, 4)
			.then(results => {

				query = results[0].url;

				ytdl(query)
					.pipe(fs.createWriteStream(file));

				console.log(query);
			})
			.catch(console.log);
	}

	getInfo(query).then(info => {

		let arr = info.items[0];

		title = arr.title;
		duration = (arr.duration / 60).toFixed(2);

		let mp4 = path.join(__dirname, '../public', 'video.mp4')
		let mp3 = path.join(__dirname, '../public', 'song.mp3')

		ffmpeg(mp4)
			.toFormat('mp3')
			.on('error', (err) => {
				console.log('An error occurred: ' + err.message);
			})
			.on('end', () => {
				let obj = {
					title: title,
					duration: duration,
					link: 'localhost:3000/song.mp3'
				};
				console.log(JSON.stringify(obj, null, '\t'));
				res.json(obj);
			})
			.save(mp3); //path where you want to save your file
			
	});
})

module.exports = router;