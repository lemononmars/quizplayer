const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', ' เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

/*
* convert a date string of the form YYYY-MM-DD to Thai date string
*/
export function dateToThaiString(date: string) {
   const year = date.slice(0,4)
   const month = parseInt(date.slice(5,7))
   const day = parseInt(date.slice(8,10))

   return `${day} ${months[month-1]} ${year}`
}

export function todayDateThaiString() {
   // GMT+7 Bangkok time 
   const d = new Date( Date.now() + 7 * 60 * 60 * 1000 )
   return dateToThaiString(d.toISOString())
}