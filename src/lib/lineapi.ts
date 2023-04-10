import line from '@line/bot-sdk'
import type {Message} from '@line/bot-sdk'

export const client = new line.Client({
   channelAccessToken: import.meta.env.VITE_LINE_ACCESS_TOKEN
})

export function reply(token: string, message: Message) {
   client.replyMessage(token, message)
      .then()
      .catch((err)=>{})
}