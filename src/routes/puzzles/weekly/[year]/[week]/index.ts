/** @type {import('./__types/[id]').RequestHandler} */
export async function get({params}) {
  const {year, week} = params

  // const res = await fetch(`/api/puzzle/weekly_solution`)
  // const data = res.json()

  return {
    body: {year, week}
  };
 }