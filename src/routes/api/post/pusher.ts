import Pusher from 'pusher'

const pusher = new Pusher({
  appId: "1444144",
  key: String(import.meta.env.VITE_PUSHER_KEY),
  secret: String(import.meta.env.VITE_PUSHER_SECRET),
  cluster: "ap1",
  useTLS: true
});

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
   let data = await request.json()
   const action = data.action

   if(action === 'submit')
      pusher.trigger('battle-channel', 'res-send-message', {
         message: 'server says ' + data 
      })
   else if (action === 'enter')
      pusher.trigger('battle-channel', 'res-new-player', {
         message: 'new player ' + data 
      })

   return {
      status: 200
   }
}