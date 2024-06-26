import fs from 'node:fs/promises'
import path from 'node:path'
import Video from '../models/video.model.js'
import { validatePartialVideo, validateVideo } from '../schemas/video.schema.js'

export const createVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errors: [{ path: 'file', message: 'video must be sent' }] })
    }

    const result = validateVideo(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    if (result.data?.tags) result.data.tags = result.data.tags.split(' ')
    
    // Obtener el ID de usuario y el nombre de usuario del cuerpo de la solicitud
    const userId = req.user.id;
    const username = req.body?.username;

    result.data.user = userId;
    result.data.filePath = req.file?.filename;

    const newVideo = new Video({
      ...result.data
    })

    console.log(result)


    const videoSaved = await newVideo.save()
    console.log('videoSaved: ', videoSaved)

    const videoData = await Video.findById(videoSaved._id).populate('user', 'username')

    const videoObject = videoData.toObject()

    return res.status(201).json({ message: 'Video saved successfully', data: videoObject })
  } catch (error) {
    console.log('controller error: ', error)
    if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
    res.status(500).json({ message: 'Error saving video', error: error.message })
  }
}

export const getVideoDataById = async (req, res) => {
  const { videoId } = req.params

  try {
    const video = await Video.findById(videoId).populate('user', 'username')

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    res.status(200).json(video)
  } catch (error) {
    res.status(500).json({ message: 'Error finding video', error: error.message })
  }
}

export const getAllUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).populate('user', 'username')
    res.status(200).json(videos)
  } catch (error) {
    res.status(500).json({ message: 'Error getting videos', error: error.message })
  }
}

export const watchVideo = async (req, res) => {
  const { videoId } = req.params

  try {
    const video = await Video.findById(videoId).populate('user')

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    const absolutePath = path.resolve(`./uploads/videos/${video.filePath}`)

    await fs.access(absolutePath, fs.constants.F_OK)

    res.status(200).sendFile(absolutePath)
  } catch (error) {
    res.status(500).json({ message: 'Error finding video', error: error.message })
  }
}

export const getThumbnail = async (req, res) => {
  const { videoId } = req.params

  try {
    const video = await Video.findById(videoId).populate('user')

    if (!video) {
      return res.status(404).json({ message: 'Video thumbnail not found' })
    }

    const absolutePath = path.resolve(`./uploads/thumbnails/${video.thumbnail}`)

    await fs.access(absolutePath, fs.constants.F_OK)

    res.status(200).sendFile(absolutePath)
  } catch (error) {
    res.status(500).json({ message: 'Error finding video thumbnail', error: error.message })
  }
}

export const updateVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errors: [{ path: 'file', message: 'video file must be send to update' }] })
    }

    const { videoId } = req.params

    const prevVideoData = await Video.findById(videoId).populate('user', 'username')

    if (!prevVideoData) {
      if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
      return res.status(404).json({ message: 'Video not found to update' })
    }

    if (req.user.id !== prevVideoData.user._id) {
      return res.status(401).json({ message: 'You are not allow to update this video, authorization denied' })
    }

    const video = await Video.findByIdAndUpdate(videoId, { filePath: req.file.filename }, { new: true }).populate('user', 'username')

    if (!video) {
      if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
      return res.status(404).json({ message: 'Fail to update video' })
    }

    await fs.unlink(path.normalize(`uploads/videos/${prevVideoData.filePath}`))

    res.status(200).json({ message: 'Video updated successfully', video })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
    res.status(500).json({ message: 'Error al actualizar el video', error })
  }
}

export const updateVideoData = async (req, res) => {
  try {
    const { videoId } = req.params

    const prevVideoData = await Video.findById(videoId)

    if (!prevVideoData) {
      if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
      return res.status(404).json({ message: 'Video not found to update' })
    }

    if (req.user.id !== prevVideoData.user._id) {
      return res.status(401).json({ message: 'You are not allow to update this video, authorization denied' })
    }

    const result = validatePartialVideo(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    if (req.file) {
      result.data.thumbnail = req.file.filename
    }

    if (result.data.tags) result.data.tags = result.data.tags.split(' ')

    const video = await Video.findByIdAndUpdate(videoId, result.data, { new: true }).populate('user', 'username')

    if (!video) {
      if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
      return res.status(404).json({ message: 'Video not found to update' })
    }

    if (req.file && prevVideoData.thumbnail !== 'defaultVideoThumbnail.png') {
      await fs.unlink(path.normalize(`uploads/thumbnails/${prevVideoData.thumbnail}`))
    }

    await fs.unlink(path.normalize(`uploads/videos/${prevVideoData.filePath}`))

    res.status(200).json({ message: 'Video updated successfully', video })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
    res.status(500).json({ message: 'Error al actualizar el video', error })
  }
}

export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params

    const prevVideoData = await Video.findById(videoId)

    if (!prevVideoData) {
      return res.status(404).json({ message: 'Video not found to delete' })
    }

    if (req.user.id !== prevVideoData.user._id) {
      return res.status(401).json({ message: 'You are not allow to delete this video, authorization denied' })
    }

    const video = await Video.findByIdAndDelete(videoId)

    if (!video) {
      return res.status(404).json({ message: 'Video no found' })
    }

    if (prevVideoData.thumbnail !== 'defaultVideoThumbnail.png') {
      await fs.unlink(path.normalize(`uploads/thumbnails/${prevVideoData.thumbnail}`))
    }

    res.status(200).json({ message: 'Video delete successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error: error.message })
  }
}