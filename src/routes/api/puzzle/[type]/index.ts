import { from } from '$lib/supabase';

/**
 * Returns stats for 'boardgame', 'content', 'person', 'event', 'manufacturer', 'publisher', 'shop'
 * for now, simply return the number of entries for each category
 * ex. /api/boardgame
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/puzzle/[type]/[id].ts').RequestHandler} */
export async function get({ params }) {

	const {type} = params;
	const { data, error } = await from(type).select('*')

	if(error) 
		return {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
			body: error
		};

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}
