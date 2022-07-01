import type {IRebus} from '$lib/interfaces'

export const rebuses: IRebus[] = [
   {
      "type": "rebus",
      "id": 1,
      "title": "Rebus 01",
      "image": "rebus01.png",
      "question": "ภาพนี้หมายถึงคำว่าอะไร?",
      "date": "2022-06-01",
      "tags": ["rebus", "word puzzle"],
      "answer": "ยาหลังอาหาร",
      "hints": [`แยกคำว่า "ยา" และ "อาหาร"`, `ลำดับการวาง อะไรอยู่หลังอะไรอยู่หน้า`]
   },
   {
      "type": "rebus",
      "id": 2,
      "title": "Rebus 02",
      "image": "rebus02.png",
      "question": "ภาพนี้หมายถึงคำว่าอะไร?",
      "date": "2022-06-02",
      "tags": ["rebus","word puzzle"],
      "answer": "กบในกะลา",
      "hints": [`แยกคำว่า "กบ" ที่อยู่ตรงกลางออกมา`, `คำที่เหลือหลังจากที่แยกแล้วคือ "กะลา"`]
   }
]