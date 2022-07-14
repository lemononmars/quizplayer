import { from } from '$lib/supabase';

/**
 * Returns tye puzzle package to be displayed
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/puzzle/[type]/[id].ts').RequestHandler} */
export async function get({ params }) {

	const {type, id} = params;
	const { data, error } = await from(type).select('*').eq('id', id);

	if(error) 
		return {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
			body: error
		};

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data[0]
	};
}


/**
 * check the answer for the requested puzzle
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/puzzle/[type]/[id].ts').RequestHandler} */
export async function post({ params }) {

	const {type, id} = params;
	let error
	let data = [{result: 'incorrect', hint: 'no hint for you'}]

	if(error) 
		return {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
			body: error
		};

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data[0]
	};
}