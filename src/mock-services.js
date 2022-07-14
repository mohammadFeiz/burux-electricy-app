
import bulb10w from './images/10w-bulb.png';
export default function services(getState) {
  let $$ = {
    async getCampaigns() {
      return [
        {name: 'کمپین 1',id: '1',background: "#FDB913",color: "#173796",src:bulb10w},
        {name: 'کمپین 2',id: '2',background: "#FDB913",color: "#173796",src:bulb10w},
        {name: 'کمپین 3',id: '3',background: "#FDB913",color: "#173796",src:bulb10w},
        {name: 'کمپین 4',id: '4',background: "#FDB913",color: "#173796",src:bulb10w}
      ]
    },
    getRandom(a,b){
      return Math.round(Math.random() * (b - a)) + a;
    },
    getRandomIndex(list){
      return list[this.getRandom(0,list.length - 1)]
    },
    getRandomProductName(){
      let name = 'لامپ'
      name += ' ';
      name += this.getRandomIndex(['حبابی','جنرال','ال ای دی','پنلی','شمعی','اس ام دی'])
      name += ' ';
      name += this.getRandomIndex(['5 وات','7 وات','10 وات','15 وات','20 وات'])
      return name;
    },
    async activeCampaignItems({campaign}) {
      return new Array(12).fill(0).map(()=>{
            return {
              name: this.getRandomProductName(),code: this.getRandom(0,1000000),id: this.getRandom(0,1000000),
              details: [["تعداد در کارتن", "100عدد"],["سرپیچ", "بزرگ"]],
              optionTypes: [
                {
                  name: "رنگ",id: "color",
                  items: [{ name: "زرد", id: "yellow" },{ name: "یخی", id: "ice" },{ name: "سفید", id: "white" },],
                },
                {
                  name: "توان",id: "power",
                  items: [{ name: "10 وات", id: "10wat" },{ name: "15 وات", id: "15wat" },],
                },
              ],
              variants: [
                {
                  optionValues: { color: "yellow", power: "10wat" },
                  discountPrice: 10,discountPercent: 10,price: this.getRandom(200000,300000),inStock: 1000,id: "1",
                },
                {
                  optionValues: { color: "ice", power: "10wat" },
                  discountPrice: 0,discountPercent: 0,price: this.getRandom(200000,300000),inStock: 1000,id: "2",
                },
                {
                  optionValues: { color: "yellow", power: "15wat" },
                  discountPrice: 10,discountPercent: 10,price: this.getRandom(200000,300000),inStock: 1000,id: "3",
                },
                {
                  optionValues: { color: "white", power: "10wat" },
                  discountPrice: 10,discountPercent: 10,price: this.getRandom(200000,300000),inStock: 1000,id: "4",
                },
                {
                  optionValues: { color: "white", power: "15wat" },
                  discountPrice: 10,discountPercent: 10,price: this.getRandom(200000,300000),inStock: 0,id: "5",
                },
                {
                  optionValues: { color: "ice", power: "10wat" },
                  discountPrice: 10,discountPercent: 10,price: this.getRandom(200000,300000),inStock: 1000,id: "6",
                },
              ]
            }
      })
    } 
  }
}