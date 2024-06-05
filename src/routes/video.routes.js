import express from 'express'
import { createVideo, deleteVideo, getAllUserVideos, getThumbnail, getVideoDataById, updateVideo, updateVideoData, watchVideo } from '../controllers/video.controllers.js'
import { authRequired } from '../middlewares/validateToken.js';
import { handleErrorThumbnail, uploadThumbnail } from '../middlewares/thumbnailMulter.middleware.js'
import { handleErrorVideo, uploadVideo } from '../middlewares/videoMulter.middleware.js'

const router = express.Router()

router.post('/videos', authRequired, uploadVideo.single('video'), handleErrorVideo, createVideo)

router.get('/videos', authRequired, getAllUserVideos)

router.get('/videos/:videoId', authRequired, getVideoDataById)

router.get('/videos/watch/:videoId', watchVideo)

router.get('/videos/thumbnail/:videoId', getThumbnail)

router.patch('/videos/:videoId', authRequired, uploadVideo.single('video'), handleErrorVideo, updateVideo)

router.patch('/videos/data/:videoId', authRequired, uploadThumbnail.single('thumbnail'), handleErrorThumbnail, updateVideoData)

router.delete('/videos/:videoId', authRequired, deleteVideo)

export default router