const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', ' เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

export function dateToThaiString(date: string) {
   const year = date.slice(0,4)
   const month = parseInt(date.slice(5,7))
   const day = parseInt(date.slice(8,10))

   return `${day} ${months[month-1]} ${year}`
}