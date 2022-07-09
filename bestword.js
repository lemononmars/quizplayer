import fs from 'fs'

fs.readFile('./src/lib/utils/dict.json', 'utf8', (err, jsonString) => {

   const dict = JSON.parse(jsonString)
   const wordLength = 7
   const NLetterWords = dict.filter((w)=> w.length == wordLength  && !w.includes('การ') && !w.includes('ความ'))
   console.log('there are ', NLetterWords.length, ' words to play with.')

   let results = []
   let id = 1
   for(const solution of NLetterWords) {
      const set = new Set(solution)
      if(set.size < wordLength)
         continue

      let solutions = []
      for(const w of dict) {
         if(w.split("").every(l => solution.includes(l))) {
            solutions = [...solutions, w]
         }
      }

      let object = {
         type: "spellingbee",
         id,
         title: "Spelling Bee " + id,
         date: "2022-07-08",
         tags: ["spelling bee", "word puzzle"],
         letters: solution.split(""),
         pangram: [solution],
         solutions
      }
      results = [...results, object]
      id ++
      if(id%100 == 0)
         console.log('at ', id, 'words')
   }
   console.log('Found ', results.length, ' pangrams of ', wordLength, ' letters.')

   fs.writeFile(`./spellingbee${wordLength}letters.json`, JSON.stringify(results), err=>{})
})

export function splitWord(word) {
   const alphas = word.split("")
   const out = []
 
   alphas.forEach((a) => {
     if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/))
       out.push(a)
   })
 
   return out
 }
