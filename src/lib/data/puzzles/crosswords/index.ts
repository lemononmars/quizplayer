import cryptic from './cryptic'

export default [
   {
      type: 'crossword',
      id: 1,
      title: "Cryptic clue 1",
      date: "2022-01-01",
      tags: ["cryptic", "crossword"],
      size: [5,5],
      clues: cryptic
   },
   {
      type: 'crossword',
      id: 2,
      title: "small grid",
      date: "2022-07-02",
      tags: ["crossword"],
      size: [2,2],
      clues: [
         {
            clue: "ไฮโซ",
            answer: "หรู",
            direction: "down",
            position: [0,0]
         },
         {
            clue: "สัตว์เลี้ยงลูกด้วยนมขนาดใหญ่",
            answer: "หมี",
            direction: "across",
            position: [0,0]
         },
         {
            clue: "กิริยาที่เอามือกำหรือจับสิ่งซึ่งมีลักษณะยาว ๆ ให้เลื่อนไปตามยาว",
            answer: "รูด",
            direction: "across",
            position: [0,1]
         },
         {
            clue: "เครื่องมือสำหรับฟัน ผ่า เป็นต้น",
            answer: "มีด",
            direction: "down",
            position: [1,0]
         },
      ]
   },
   {
      type: 'crossword',
      id: 3,
      title: "BIG GRID",
      date: "2022-07-02",
      tags: ["crossword"],
      size: [10,10],
      clues: [
         {
            clue: "หน่วยงานที่ดูแลทางหลวง",
            answer: "กรมทางหลวง",
            direction: "down",
            position: [0,0]
         },
         {
            clue: "สำนึกผิด เปลี่ยนเป็นคนใหม่",
            answer: "กลับตัวกลับใจ",
            direction: "across",
            position: [0,0]
         },
         {
            clue: "ART",
            answer: "งานศิลปกรรม",
            direction: "across",
            position: [0,9]
         },
         {
            clue: "อุปกรณ์ขนาดใหญ่ ใช้รับสัญญาณคลื่นวิทยุ",
            answer: "จานดาวเทียม",
            direction: "down",
            position: [9,0]
         },
      ]
   }
]