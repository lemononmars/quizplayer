import event01 from "./event01.md"
import event02 from "./event02.md"
import event03 from "./event03.md"
import event04 from "./event04.md"
import event05 from "./event05.md"

export function getMD(id: number){
   switch(id) {
      case 1: return event01
      case 2: return event02
      case 3: return event03
      case 4: return event04
      case 5: return event05
      default: return event01
   }
}