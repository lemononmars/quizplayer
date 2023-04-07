import line from '@line/bot-sdk'

const client = new line.Client({
	channelAccessToken: import.meta.env.VITE_LINE_ACCESS_TOKEN
})

/**
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/line/index.ts').RequestHandler} */
export async function post({ request }) {

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};

	let req = request
	if (req.body.events[0].type === "message") {
		// Message data, must be stringified
		const dataString = JSON.stringify({
		  replyToken: req.body.events[0].replyToken,
		  messages: [
			 {
				"type": "text",
				"text": "Hello, user " + req.body.events[0].message.text
			 },
			 {
				"type": "text",
				"text": "May I help you?"
			 }
		  ]
		})
  
		// Request header
		const headers = {
		  "Content-Type": "application/json",
		  "Authorization": "Bearer " + TOKEN
		}
  
		// Options to pass into the request
		const webhookOptions = {
		  "hostname": "api.line.me",
		  "path": "/v2/bot/message/reply",
		  "method": "POST",
		  "headers": headers,
		  "body": dataString
		}
  
		// Define request
		const request = https.request(webhookOptions, (res) => {
		  res.on("data", (d) => {
			 process.stdout.write(d)
		  })
		})
  
		// Handle error
		request.on("error", (err) => {
		  console.error(err)
		})
  
		// Send data
		request.write(dataString)
		request.end()
	 }
}
