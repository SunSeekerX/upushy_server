import * as dotenv from 'dotenv'
const envPath = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''

dotenv.config({
  path: `.env${envPath}`,
})
