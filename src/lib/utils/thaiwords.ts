import dict from '$lib/utils/dict'

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
   return a.match(consonantRegex) && (b.match(upperLetterRegex) || b.match(lowerLetterRegex))
}

export function isUpper(a: string) {
    return a.match(upperLetterRegex)
}

export function isLower(a: string) {
    return a.match(lowerLetterRegex)
}

export function isTall(a: string) {
    return a === 'ใ' || a === 'ไ'
}

export const consonantRegex = /[\u0E01-\u0E2E]/
export const upperLetterRegex = /[\u0E31\u0E34-\u0E37\u0E47-\u0E4C`]/
export const lowerLetterRegex = /[\u0E38-\u0E39]/

export function search(word: string) {
    return dict.includes(word)
}