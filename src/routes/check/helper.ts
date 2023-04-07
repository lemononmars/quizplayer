

export function decode(s:string) {
  return decodeURIComponent(atob(s).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export function encode(s:string) {
  return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}