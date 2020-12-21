const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const auth = require('./auth');
// Image compression
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
var aws = require('aws-sdk');
var { v4: uuidv4 } = require('uuid');
const File = require('../../models/File');
const User = require('../../models/User');
require('dotenv').config();

aws.config.update({
	region: 'us-east-1', // Put your aws region here
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_ACCESS_SECRET
});

const s3 = new aws.S3();

const VALID_MIM_TYPES = /(jpg|jpeg|png)/i

router.post('/', auth, upload.single('image'), (req, res) => {

	if (!req.file.mimetype.match(VALID_MIM_TYPES)) {
		return res.status(422).json({
			ok: false,
			message: ""
		})
	} else {
		imagemin.buffer(req.file.buffer, {
			plugins: [
				imageminJpegtran(),
				imageminPngquant()
			]
		})
			.then(buff => {
				const s3_params = {
					Bucket: process.env.S3_BUCKET,
					Body: buff,
					Key: uuidv4() + '.' + req.file.originalname.split('.').pop()
				}
				var uploadPromise = s3.upload(s3_params).promise();
				return uploadPromise;
			})
			.then(data => {
				console.log(data)
				if (data) {
					return data;
				} else {
					console.log(hello)
					throw new Error("Error");
				}
			})
			.then((data) => {
				const image = new File({
					s3_key: data.Key,
					type: req.file.mimetype
				})
				return image.save()
			})
			.then(doc => {
				return User.findByIdAndUpdate(res.locals._id, {
					$addToSet: {
						images: doc._id
					}
				})
			})
			.then(user => {
				return res.status(200).json({
					ok: true
				});
			})
			.catch(err => {
				console.log(err)
				return res.status(500).json({
					ok: false,
					message: err.message
				})
			})
	}
})

router.get('/', auth, (req, res) => {
	var image = null;
	User.findById(res.locals._id)
		.select('images')
		.populate({
			path: 'images',
			select: [
				's3_key',
				'type'
			],
			limit: 1,
			options: {
				sort: {
					createdAt: -1,
				}
			}
		})
		.exec()
		.then(doc => {
			image = doc.images[0];
			const data = s3.getObject({
				Key: image.s3_key,
				Bucket: process.env.S3_BUCKET
			}).promise();
			return data;
		})
		.then(data => {
			res.status(200).json({
				data: Buffer.from(data.Body).toString('base64'),
				type: image.type
			})
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			})
		})
})

module.exports = router;