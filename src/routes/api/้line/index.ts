import { from } from '$lib/supabase';

/**
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/line/index.ts').RequestHandler} */
export async function post({ request }) {

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
