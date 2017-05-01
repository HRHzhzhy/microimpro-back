import Express from 'express'
export const router = Express.Router()
router.get('/', (req, res) => {
  res.send('hello express index router')
})
export default exports