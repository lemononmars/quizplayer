/** @type {import('./__types/[id]').RequestHandler} */
export async function get({params}) {
  const {year, week} = params

  return {
    body: { year, week}
  };
 }