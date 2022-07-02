import type {IHangman} from '$lib/interfaces'

export const hangman: IHangman[] = [
   {
      type: "hangman",
      id: 1,
      title: "สุภาษิต",
      date: "2022-07-02",
      tags: ["hangman", "word puzzle"],
      hints: ["อาหาร"],
      answers: ["กว่าถั่วจะสุกงาก็ไหม้"]
   },
   {
      type: "hangman",
      id: 2,
      title: "ฤดูร้อน",
      date: "2022-07-02",
      tags: ["hangman", "word puzzle"],
      hints: ["ทะเล", "ชายหาด", "อาหาร"],
      answers: ["สวนสยามทะเลกรุงเทพ", "กว่าจะรวมจิตใจเก็บทรายสวยๆมากอง", "ปลากะพงนึ่งมะนาว"]
   },
]