import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const newName = `${Date.now()}-${file.originalname}`
    cb(null, newName)
  }
})

const filterVideos = (req, file, cb) => {
  const { mimetype } = file
  const mimeAlloweds = ['video/mp4', 'video/webm']

  if (mimeAlloweds.includes(mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Archivo de video no permitido'))
  }
}

export const uploadVideo = multer({ storage, fileFilter: filterVideos })