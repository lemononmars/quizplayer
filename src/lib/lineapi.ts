import line from '@line/bot-sdk'
import type {Message} from '@line/bot-sdk'

export const client = new line.Client({
   channelAccessToken: String(import.meta.env.VITE_LINE_ACCESS_TOKEN)
})

export async function reply(token: string, message: Message | Message[]) {
   client.replyMessage(token, message)
      .then()
      .catch((err)=>{})
}