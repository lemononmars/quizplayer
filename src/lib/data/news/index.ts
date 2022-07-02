import type {INews} from '$lib/interfaces'

export const news: INews[] = [
   {
      "type": "news",
      "id": 1,
      "title": "First news",
      "image": "news1.png",
      "date": "2022-01-01",
      "tags": ["event", "competition"],
      "content": `
      # hey
      
      ## test 2
      `,
   },
   {
      "type": "news",
      "id": 2,
      "title": "Next one",
      "image": "news2.png",
      "date": "2022-06-01",
      "tags": ["news"],
      "content": "news1.md",
   }
]