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

	const {type, id} = params;
	const { data, error } = await from(type).select('*').eq('id', id);

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}
