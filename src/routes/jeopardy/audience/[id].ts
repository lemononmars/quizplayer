export async function get({ params }) {
  const {id} = params
  return {
    body: { id }
  }
}

