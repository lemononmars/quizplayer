export function splitWord(word: string) {
   var alphas = word.split("");
   var out: string[] = [];
   alphas.forEach(function (a) {
       if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/) || a.match(/[\.\*\/]/)) {
           out.push(a);
       }
       else {
           out[out.length - 1] += a;
       }
   });
   return out;
}

export function isLegal(a: string) {
   return a.length == 1 && a.match(/[\u0E00-\u0E4C]/)
}

export function appendable(a: string, b: string) {
   return a.match(/[ก-ฮ]/) && b.match(/[\u0E31\u0E34-\u0E39\u0E47-\u0E4D]/)
}