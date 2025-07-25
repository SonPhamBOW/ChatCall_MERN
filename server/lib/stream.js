import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STREAM_API_KEY
const apiKeySecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiKeySecret){
    console.error();
}
