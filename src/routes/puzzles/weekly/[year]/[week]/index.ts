/** @type {import('./__types/[id]').RequestHandler} */
import { from } from '$lib/supabase'
export async function get({params}) {
  const {year, week} = params

  const { data, error } = await from('weekly_solution').select('*').eq('week', week).eq('year', year);
  if(data) {
    const title = await data[0].title
    return {
      body: {year, week, title}
    };  
  }

  return {
    status:302,
    redirect: "/puzzles/weekly"
  };
 }