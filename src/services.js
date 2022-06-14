import Axios from 'axios';
import dateCalculator from './utils/date-calculator';
import $ from 'jquery';
import axios from 'axios';
export default async function services(type,parameter,loading = true) {
    let d = dateCalculator();
    let $$ = {
        fixDate(obj,field){
            let date = obj[field]
            try{
                if(date.indexOf('T') !== -1){
                    let time = date.split('T')[1];
                    obj._time = time.split('.')[0]
                }
                else {
                    let time = date.split(' ')[1];
                    obj._time = time
                }
                
            }
            catch{obj._time = undefined}
            try{
                obj[field] = d.gregorianToJalali(date).join('/')
            } 
            catch{obj[field] = '';}
            return obj
        },
        fix(list,{convertDateFields = [],convertArabicFields = []}){
            return list.map((o)=>{
                for(let i = 0; i < convertDateFields.length; i++){
                    $$.fixDate(o,convertDateFields[i])
                }
                for(let i = 0; i < convertArabicFields.length; i++){
                    try{o[convertArabicFields[i]] = o[convertArabicFields[i]].replace(/ك/g, 'ک').replace(/ي/g, 'ی')} 
                    catch{o[convertArabicFields[i]] = '';}    
                }
                return o
            })
        },
        async kalahaye_garanti_shode(){
            let res = await Axios.post('https://retailerapp.bbeta.ir/api/v1/Guarantee/GetAllGuarantees',{CardCode:'C50000'})
            if(res.data && res.data.isSuccess){
                return $$.fix(res.data.data.Items,{convertDateFields:['CreateTime']});
            }
            else{
                return []
            }
        },
        async kalahaye_mojoode_garanti(){
            let res = await Axios.get('https://retailerapp.bbeta.ir/api/v1/Guarantee/GetAllProducts')
            if(res.data && res.data.isSuccess){
                return res.data.data;
            }
            else{
                return []
            }
        },
        async sabte_kalahaye_garanti(Items){
            let res = await Axios.post('https://retailerapp.bbeta.ir/api/v1/Guarantee',{CardCode:'C50000',Items})
            if(res.data && res.data.isSuccess){
                return true
            }
            else{
                return false
            }
        },
        async get_all_awards(){
            let res = await Axios.get('https://retailerapp.bbeta.ir/api/v1/Awards')
            if(res.data && res.data.isSuccess){
                return res.data.data;
            }
            else{
                return []
            }
            
        },
        async get_tested_chance(){
            let today = d.getToday('jalali');
            let date = [1401,1,1];
            //let date = today;
            return `${today[0]},${today[1]},${today[2]}` === `${date[0]},${date[1]},${date[2]}`;
        },
        async save_catched_chance(award){
            debugger;
            let res = await Axios.post('https://retailerapp.bbeta.ir/api/v1/UserAwards',{UserId:1,AwardId:award.award.id,Win:award.result})
            return res.data.isSuccess;
        },
        async get_user_awards(){
            let res = await Axios.get('https://retailerapp.bbeta.ir/api/v1/UserAwards')
            if(res.data && res.data.isSuccess){
                let list = res.data.data.map((o)=>{
                    return {title:o.award.title,subtitle:o.award.shortDescription,date:o.createdDate,used:o.usedDate !== null,code:o.id}
                });
                return $$.fix(list,{convertDateFields:['date']})
            }
            else{
                return []
            }
        },

        async peygiriye_sefareshe_kharid(){
            let res = await Axios.post('https://retailerapp.bbeta.ir/api/v1/Visit/GetAllUserPreOrder',{
                "CardCode":"c50000",
                "Page":1
            })
            let result = res.data.data.Items;
            let visitorWait = [];
            let factored = [];
            let inProcess = [];
            let inShopTrack = [];
            let delivered = [];
            let canceled = [];
            let rejected = [];
            for(let i = 0; i < result.length; i++){
                let o = result[i];
                if(o.Status === 1){
                    visitorWait.push({
                        number:o.ID,
                        date:o.Time,
                        total:o.TotalPrice,
                        items:o.Items.map((item)=>{
                            return {
                                name:item.ProductName,
                                Qty:item.Count
                            }
                        })
                    })
                }
                if(o.Status === 2){
                    factored.push({
                        number:o.ID,
                        date:o.Time,
                        total:o.TotalPrice,
                        items:o.Items.map((item)=>{
                            return {
                                name:item.ProductName,
                                Qty:item.Count
                            }
                        })
                    })
                }
            }
            return {
                visitorWait,factored,inProcess,inShopTrack,delivered,canceled,rejected
            }
            // return {
            //     inProcess:[
            //         {
            //             number:'1230402',date:'1400/8/28',total:124000,
            //             customerName:'محمد شریف فیض',
            //             customerCode:'136444',
            //             customerGroup:'الکتریکی',
            //             campain:'طرح نورواره',
            //             basePrice:'زمستان',
            //             visitorName:'حسین احمدی',
            //             visitorCode:'4235332',
            //             address:'تهران، اتوبان رسالت، بعد از پارک رسالت نرسیده به اتوبان صیاد شیرازی پلاک 1234  ',
            //             mobile:'09123534314',
            //             phone:'021-88050006',
            //             paymentMethod:'آنلاین',
            //             status:1,
            //             items:[
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //                 {name:'حبابی 20 وات شمعی',Qty:10,color:'آفتابی',unit:'شعله',discountPercent:30,discountPrice:61000,price:34000},
            //             ]
            //         }
            //     ],
            //     delivered:[],
            //     rejected:[],
            //     canseled:[],
            // }
        },
        async joziatepeygiriyesefareshekharid(id){
            let res = await Axios.post('https://retailerapp.bbeta.ir/api/v1/Visit/PreOrderDetails',{ "OrderId":id});            
            let result = res.data.data;
            result = {
                number:id,
                date:result.Time,
                customerName:result.CustomerName,
                customerCode:result.CardCode,
                customerGroup:result.StoreBranch,
                campain:result.CampaignName,
                basePrice:'نداریم',
                visitorName:'نداریم',
                address:'نداریم',
                mobile:'نداریم',
                phone:'نداریم',
                total:result.TotalPrice,
                paymentMethod:result.DeliveryType,
                items:result.Items.map((o)=>{
                    return {
                        name:o.ProductName,
                        Qty:o.Count,
                        color:'آفتابی',
                        discountPrice:0,
                        discountPercent:0,
                        unit:'',
                        price:o.MinPrice
                    }
                })

            }
            
            return result
            
        },
        async getCampaigns(){
            let res = await Axios.get('https://retailerapp.bbeta.ir/api/v1/Spree/GetAllCampaigns');
            let result = res.data.data.included;
            result = result.filter((o)=>{
                return o.id.toString() === '10178' || o.id.toString() === '10181'
            })
            return result.map((o)=>{
                return {
                    name:o.attributes.name,
                    id:o.id,
                    background:'#0094D4',
                    color:'#fff'
                }
            })
        },
        async activeCampaignItems(id){
            let res = await Axios.get(`https://retailerapp.bbeta.ir/api/v1/Spree/GetTaxonByIdWithItsProducts?id=${id}`);
            // let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Visit/GetAllSpreeProducts`,{
            //     "SpreeTaxon":id,
            //     "CardCode":"c50000"
            // });
            let result = res.data.data.included;
            // result = result.filter((o)=>{
            //     return o.attributes.in_stock
            // })
            return result.map((o)=>{
                return {
                    name:o.attributes.name,
                    discountPrice:0,
                    discountPercent:0,
                    price:o.attributes.price
                }
            })
        },
        async getLastOrders(){
            let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Visit/GetAllUserPreOrder`,{
                "CardCode":"c50000",
                "Page":1
            });
            let result = res.data.data.Items;
            result = result.filter((o,i)=>o.Status === 2)
            result = result.slice(0,Math.min(result.length,5));
            let items = [];
            for(let i = 0; i < result.length; i++){
                items = items.concat(result[i].Items.map((item)=>{
                    return {
                        name:item.ProductName,
                        discountPrice:0,
                        discountPercent:0,
                        price:item.MinPrice
                    }
                }))
            }
            return items            
        },
        async getPreOrders(){
            let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Visit/PreOrderStat`,{
                "CardCode":"c50000"
            });
            let result = res.data.data;
            let preOrders = {
                waitOfVisitor: 10,
                waitOfPey: 2
            }
            for(let i = 0; i < result.length; i++){
                if(result[i].Status === 1){
                    preOrders.waitOfVisitor = result[i].Count
                }
                if(result[i].Status === 2){
                    preOrders.waitOfPey = result[i].Count
                }
            }
            return preOrders
        },
        async search(searchValue){
            let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Spree/Products`,{
                Name:searchValue,
                Include:'images'
            });
            let result = res.data.data.data;
            let included = res.data.data.included;
            return result.map((o)=>{
                let src;
                try{
                    let imgId = o.relationships.images.data[0].id;
                    src = included.filter((m)=>m.id === imgId)[0].attributes.original_url;
                }
                catch{
                    src = ''
                }
                return {
                    name:o.attributes.name,price:o.attributes.price,unit:'',
                    src:`http://spree.burux.com${src}`,discountPercent:0,discountPrice:0
                }
            })
            
        },
        async getCategories(){
            let res = await Axios.get(`https://retailerapp.bbeta.ir/api/v1/Spree/GetAllCategories`);
            let included = res.data.data.included;
            let categories = included.map((o)=>{                
                return {
                    name:o.attributes.name,id:o.id
                }
            })
            for(let i = 0; i < categories.length; i++){
                let o = categories[i];
                let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Spree/Products`,{
                    Include:'images',
                    Taxons:o.id.toString()
                });
                let items = res.data.data.data;
                let included = res.data.data.included;
                o.items = items.map((item)=>{
                    let imgId = item.relationships.images.data[0].id;
                    let src = included.filter((m)=>m.id === imgId)[0].attributes.original_url;
                    return {
                        name:item.attributes.name,price:item.attributes.price,discountPercent:0,discountPrice:0,
                        src:`http://spree.burux.com${src}`
                    }
                })
            }
            return categories;
        },
        
        

    }
    if(loading){$('.loading').css('display','flex');}
    let result = await $$[type](parameter);
    $('.loading').css('display','none');
    return result;
}



