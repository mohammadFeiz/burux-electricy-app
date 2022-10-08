import Axios from "axios";
import dateCalculator from "./utils/date-calculator";
import $ from "jquery";
import bulb10w from './images/10w-bulb.png';
import nosrc from './images/no-src.png';
export default function services(getState,token,userCardCode) {
  Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  let fn = function () {
    return {
      async guaranteeItems({ fix, baseUrl }) {
        let res = await Axios.post(`${baseUrl}/Guarantee/GetAllGuarantees`, { CardCode: userCardCode });
        if(res.status === 401){return false}
        if (res.data && res.data.isSuccess && res.data.data) {
          let items = fix(res.data.data.Items, { convertDateFields: ["CreateTime"] });
          items = items.map((o) => {
            return { ...o, Details: o.Details.map((d) => { return { ...d } }) }
          })
          return {items,total:res.data.data.TotalItems}
        }
        else { return {items:[],total:0}; }
        // return [];
      },
      async kalahaye_mojoode_garanti({ baseUrl }) {
        let res = await Axios.get(`${baseUrl}/Guarantee/GetAllProducts`);
        if (!res || !res.data || !res.data.isSuccess || !res.data.data) {
          console.error('Guarantee/GetAllProducts data error')
        }
        else if (!res.data.data.length) {
          console.error('Guarantee/GetAllProducts list is empty')
        }
        return res.data && res.data.isSuccess && res.data.data ? res.data.data : [];
      },
      async sabte_kalahaye_garanti({ baseUrl, parameter }) {
        let res = await Axios.post(`${baseUrl}/Guarantee`, { CardCode: userCardCode, Items: parameter });
        return !!res.data && !!res.data.isSuccess
      },
      async get_all_awards({ baseUrl }) {
        let res = await Axios.get(`${baseUrl}/Awards`);
        return res.data && res.data.isSuccess ? res.data.data : [];
      },
      async get_tested_chance({ dateCalculator }) {
        let today = dateCalculator.getToday("jalali"), date = [1401, 1, 1];
        return (`${today[0]},${today[1]},${today[2]}` === `${date[0]},${date[1]},${date[2]}`);
      },
      async save_catched_chance({ parameter, baseUrl }) {
        let res = await Axios.post(`${baseUrl}/UserAwards`, { UserId: 1, AwardId: parameter.award.id, Win: parameter.result });
        return res.data.isSuccess;
      },
      async get_user_awards({ fix, baseUrl }) {
        let res = await Axios.get(`${baseUrl}/UserAwards`);
        if (res.data && res.data.isSuccess) {
          let list = res.data.data.map((o) => {
            return { title: o.award.title, subtitle: o.award.shortDescription, date: o.createdDate, used: o.usedDate !== null, code: o.id };
          });
          return fix(list, { convertDateFields: ["date"] });
        }
        else { return []; }
      },
      // async peygiriye_sefareshe_kharid({baseUrl}) {
      //   let res = await Axios.post(`${baseUrl}/Visit/GetAllUserPreOrder`,{CardCode: userCardCode,Page: 1});
      //   let result = res.data.data.Items;
      //   let visitorWait = [],factored = [],inProcess = [],inShopTrack = [],delivered = [],canceled = [],rejected = [];
      //   for (let i = 0; i < result.length; i++) {
      //     let o = result[i];
      //     if (o.Status === 1) {
      //       visitorWait.push({
      //         number: o.ID,date: o.Time,total: o.TotalPrice,
      //         items: o.Items.map((item) => {return {name: item.ProductName,Qty: item.Count};}),
      //       });
      //     }
      //     if (o.Status === 2) {
      //       factored.push({
      //         number: o.ID,date: o.Time,total: o.TotalPrice,
      //         items: o.Items.map((item) => {return {name: item.ProductName,Qty: item.Count}})
      //       });
      //     }
      //   }
      //   return {visitorWait,factored,inProcess,inShopTrack,delivered,canceled,rejected};
      // },
      async peygiriye_sefareshe_kharid({ baseUrl, fixDate }) {
        let res = await Axios.post(`${baseUrl}/BOne/GetAllOrders`, {
          "FieldName": "cardcode",
          "FieldValue": userCardCode,
          "StartDate": "2022-06-19",
          "QtyInPage": 1000,
          "PageNo": 1
        })
        let result = res.data.data.results;
        let dict = {};
        for (let i = 0; i < result.length; i++) {
          let o = result[i];
          if (!dict[o.orderState]) {
            dict[o.orderState] = [];
          }
          for (let j = 0; j < o.documents.length; j++) {
            let item = o.documents[j];
            dict[o.orderState].push({
              docType: item.docType, isDraft: item.isDraft, docEntry: item.docEntry, date: fixDate({ date: item.docTime }, "date").date, total: item.documentTotal
            });
          }
        }
        return dict
        //return {visitorWait,factored,inProcess,inShopTrack,delivered,canceled,rejected};
      },
      async ordersHistory({ baseUrl, fixDate }) {
        let res = await Axios.post(`${baseUrl}/BOne/GetOrders`, {
          "FieldName": "cardcode",
          "FieldValue": userCardCode,
          // "StartDate":"2022-06-01",
          "StartDate": "2022-06-01",
          "QtyInPage": 1000,
          "PageNo": 1
        });

        // const results= res.data.data.results.map((x)=>x.orderState);
        let tabsDictionary = {
          darHaleBarresi: [],
          pardakhtShode: [],
          amadesaziJahateHaml: [],
          tasvieShode: [],
          Returned: [],
          Canselled: [],
          Rejected: [],
          NotSet:[],
          PendingPreOrder:[],
          Registered:[],
          SalesApproved:[],
          WaitingForPayment:[],
          Delivered:[],
          Invoiced :[],
          PartiallyDelivered:[]
        };
        const results = res.data.data.results;
        if(!Array.isArray(results)){return 'سفارشی تا کنون ثبت نشده است'}
        for (let order of results) {
          let id = order.docStatus;
          if(id === 'PreOrder' ||id === 'CustomeApproved' ||id === 'VisitorApproved' ||id === 'SupervisorApproved' ||id === 'ManagerApproved'){
            tabsDictionary['darHaleBarresi'].push(order)
          }
          else if(id === 'PaymentPassed' ||id === 'PaymentApproved'){
            tabsDictionary['pardakhtShode'].push(order)
          }
          else if(id === 'WarhousePicked' ||id === 'DeliveryPacked'){
            tabsDictionary['amadesaziJahateHaml'].push(order)
          }
          else if(id === 'Settlled' ||id === 'SettledWithBadDept'){
            tabsDictionary['tasvieShode'].push(order)
          }
          
          else if (tabsDictionary[id]) {
            tabsDictionary[id].push(order)
          }
          else {
            alert('unknown order')
          }
        }
        const orderStatuses = {
          //Registered :"ثبت نام اولیه صورت گرفت منتظر تماس پشتیبان خود باشید",
          darHaleBarresi: "در حال بررسی",//
          pardakhtShode:'پرداخت شده',
          amadesaziJahateHaml:'آماده سازی جهت حمل',
          tasvieShode:'تسویه شده',
          Returned:'مرجوع شده',
          Canselled:'لغو شده',
          Rejected:'رد شده',
          NotSet:'نا مشخص',
          PendingPreOrder:'ارسال شده برای ویزیتور',
          Registered:'سفارش ثبت شده',
          SalesApproved:'تایید واحد مالی',
          WaitingForPayment :'در انتظار پرداخت',
          Delivered :'تحویل شده',
          Invoiced :'فاکتور شده',
          PartiallyDelivered :'بخشی از سفارش تحویل شده'
        }

        let tabs = [];
        let orders = [];
        for (let id in tabsDictionary) {
          tabs.push({ id, name: orderStatuses[id] });
          for (let product of tabsDictionary[id]) {
            orders.push(
              {
                code: product.mainDocEntry,
                mainDocisDraft: product.mainDocisDraft,
                mainDocType: product.mainDocType,
                date: fixDate({ date: product.mainDocDate }, "date").date,
                total: product.mainDocTotal, tabId: id
              }
            )
          }
        }
        return { tabs, orders };
      },
      // async orderProducts({baseUrl,parameter}){
      async orderProducts({ baseUrl, fixDate, parameter, getState, services }) {
        let { userInfo } = getState();
        let { order } = parameter;
        console.log(order);

        const docTypeDictionary = {
          Customer: 2,
          Quotation: 23,
          Order: 17,
          Invoice: 13,
          CreditMemo: 14,
          MarketingDraft: 112,
          PaymentDraft: 140,
          ReturnRequest: 234000031,
          Return: 16,
          Delivery: 15,
          PickList: 156,
          IncomingPayment: 24,
          OutgoingPayment: 46,
          ProductionOrder: 202,
          DownPayment: 203,
          InventoryTransfer: 67,
          GoodsReceipt: 59,
          GoodsIssue: 60,
          InventoryTransferReuqest: 1250000001,
          PurchaseOrder: 22,
          PurchaseQuotation: 540000006,
          PurchaseRequest: 1470000113,
        };

        const campaignDictionary = {
          NA: 1,
          LinearSpecialSale: 2,
          GoldenWatt: 5,
          Golden10W: 4,
          ArianSpecialSale: 3,
          NULL: 6,
          Noorvareh2: 7,
          NoorvarehSpecial: 8,
          Eidaneh: 9,
          Special10w: 10,
          HotDelivery: 11,
          HotSummer2022: 12,
        }

        let res = await Axios.post(`${baseUrl}/BOne/GetDocument`, {
          "DocEntry": order.code,
          "DocType": docTypeDictionary[order.mainDocType],
          "isDraft": order.mainDocisDraft
        });
        let result = res.data.data.results;
        const products = result.marketingLines.map((i) => {
          return {
            name: i.itemName, discountPrice: i.priceAfterVat, dicountPercent: i.discountPercent, price: i.price, count: i.itemQty, src: bulb10w,
            details: [['رنگ نور', 'آفتابی'], ['واحد', 'شعله']]
          };
        })
        return {
          products,
          paymentMethod: result.paymentdetails.paymentTermName,
          visitorName: result.marketingdetails.slpName,
          customerName: result.cardName,
          customerCode: result.cardCode,
          customerGroup: result.cardGroupCode,
          basePrice: result.documentTotal,
          campaignName: campaignDictionary[result.marketingdetails.campaign],
          address: result.deliverAddress,
          phone: userInfo.phone1,
          mobile: userInfo.phone2,
        }
      },
      async joziatepeygiriyesefareshekharid({ baseUrl, fixDate, parameter, getState, services }) {
        let { userInfo } = getState();
        let res = await Axios.post(`${baseUrl}/BOne/GetDocument`, {
          "docentry": parameter.docEntry,
          "DocType": parameter.docType,
          "isDraft": parameter.isDraft
        });
        let result = res.data.data.results;

        let total = 0, basePrice = 0, visitorName, paymentMethod;
        let { marketingLines = [], marketingdetails = {}, paymentdetails = {} } = result;
        visitorName = marketingdetails.slpName;
        paymentMethod = paymentdetails.paymentTermName || '';

        for (let i = 0; i < marketingLines.length; i++) {
          let { priceAfterVat = 0, price = 0 } = result.marketingLines[i];
          total += priceAfterVat;
          basePrice += price;
        }
        result = {
          number: parameter,//
          date: fixDate({ date: result.docTime }, "date").date,//
          customerName: result.cardName,//
          customerCode: result.cardCode,//
          customerGroup: result.cardGroupCode,//
          campain: result.marketingdetails.campaign,//
          basePrice,//
          visitorName,//
          address: result.deliverAddress || '',//
          mobile: userInfo.phone1,//
          phone: userInfo.phone2,//
          total,//
          paymentMethod,//
          items: marketingLines.map((o) => {
            return {
              name: o.itemName,//
              count: o.itemQty,//
              discountPrice: o.discount,//
              discountPercent: o.discountPercent,//
              unit: o.unitOfMeasure,//
              price: o.priceAfterVat,//
              src: undefined
            };
          }),
        };

        return result;
      },
      async userInfo({ baseUrl }) {
        let res = await Axios.post(`${baseUrl}/BOne/GetCustomer`, { "DocCode": userCardCode });

        if(res.status===401){
          return false;
        }

        try { res = res.data.data.customer }
        catch { res = {} }
        return res
      },
      async getCampaigns({ baseUrl }) {
        let res = await Axios.get(`${baseUrl}/Spree/GetAllCampaigns`);
        let result = res.data.data.data;
        return result.map((o) => { return { name: o.attributes.name, id: o.id } });
      },
      async campaignsProducts({ baseUrl, parameter,getState }) {
        let { campaigns } = parameter;
        let result = {};
        for (let i = 0; i < campaigns.length; i++) {
          let campaign = campaigns[i];
          let res = await this.getTaxonProducts({ baseUrl, parameter: { Taxons: campaign.id } })
          res = res.map((o) => { 
            return { ...o, campaign } 
          })
          result[campaign.id] = res;
        }
        return result;
      },
      async getCampaignProducts({ baseUrl, parameter }) {
        let { campaign } = parameter;
        let { id } = campaign;
        let res = await this.getTaxonProducts({ baseUrl, parameter: { Taxons: id, type:0 } })
        return getState().updateProductPrice(res.map((o) => { return { ...o, campaign } }),'services => getCampaignProducts')
      },
      async lastOrders({ baseUrl }) {
        const taxonProductsList=await this.getTaxonProducts({baseUrl,parameter:{Taxons:'10179', type:0}});
        return getState().updateProductPrice(taxonProductsList,'services => lastOrders');
      },
      async recommendeds({ baseUrl,getState }) {
        return getState().updateProductPrice(await this.getTaxonProducts({baseUrl,parameter:{Taxons:'10550', type:0}}),'services => recommendeds')
      },
      async bestSellings({baseUrl,getState}){
        return getState().updateProductPrice(await this.getTaxonProducts({baseUrl,parameter:{Taxons:'10178', type:0}}),'services => bestSellings')
      },
      async preOrders({ baseUrl }) {
        let preOrders = { waitOfVisitor: 0, waitOfPey: 0 };
        let res = await Axios.post(`${baseUrl}/Visit/PreOrderStat`, { CardCode: userCardCode });
        if (!res || !res.data || !res.data.data) {
          console.error('services.preOrders Error!!!')
          return preOrders;
        }
        let result = res.data.data;
        for (let i = 0; i < result.length; i++) {
          if (result[i].Status === 1) { preOrders.waitOfVisitor = result[i].Count; }
          if (result[i].Status === 2) { preOrders.waitOfPey = result[i].Count; }
        }
        return preOrders;
      },
      async search({ parameter, baseUrl }) {
        let searchValue = parameter
        let res = await Axios.post(`${baseUrl}/Spree/Products`, { Name: searchValue, Include: "images" });
        let result = res.data.data.data;
        let included = res.data.data.included;
        return result.map((o) => {
          let src;
          try {
            let imgId = o.relationships.images.data[0].id;
            src = included.filter((m) => m.id === imgId)[0].attributes.original_url;
          }
          catch { src = ""; }
          return { name: o.attributes.name, price: o.attributes.price, unit: "", src: `http://shopback.bpilot.ir${src}`, discountPercent: 0, discountPrice: 0 };
        });
      },
      async register({baseUrl,parameter}){
        let res = await Axios.post(`${baseUrl}/Users/NewUser`, parameter);
        let result = false;
        try{
          result = res.data.isSuccess || false
        }
        catch{result = false}
        return result;
      },
      async bazargah_orders({baseUrl,parameter}){
        let {type} = parameter;
        let res = await Axios.get(`${baseUrl}/OS/GetWithDistance?cardCode=${userCardCode}&distance=100&status=${{'wait_to_get':'1','wait_to_send':'2'}[type]}`); // 1 for pending
        let data = [];
        try{data = res.data.data || [];}
        catch{data = []}
        let time = getState().bazargah[{'wait_to_get':'forsate_akhze_sefareshe_bazargah','wait_to_send':'2'}[type]];
        let result = data.map((order)=>this.bazargahItem({parameter:{order,time,type}}));
        return result.filter((order)=>order !== false)
      },
      bazargahItem({parameter}){
        let {order,time,type} = parameter;
        let bulbSrc = bulb10w;
        let distance = 0;
        let orderItems=[];
        try{
          distance = +order.distance.toFixed(2) * 1000
          orderItems=order.orderItems.map(i=>{    
            let src=i.imagesUrl.length ? i.imagesUrl.split(",")[0]:bulbSrc;
            return {name:i.productName,detail:`${i.options} - ${i.quantity}`,src:src};
          })
        }
        catch{
          distance = 0;
          orderItems=[];
        }
        let now = new Date().getTime();
        let date = new Date(order.orderDate).getTime()
        let passedTime = now - date;
        passedTime = passedTime / 1000 / 60;
        let forsat = {'wait_to_get':'forsate_akhze_sefareshe_bazargah','wait_to_send':'forsate_ersale_sefareshe_bazargah'}[type];
        let totalTime = getState().bazargah[forsat];
        if(passedTime > totalTime){return false} 
        return {
          type,
          "amount":order.finalAmount,
          distance,
          "benefit":110000,
          "totalTime":time,
          "address": order.billAddress,
          "items":orderItems,
          "cityId": null,
          "provinceId": null,
          "buyerId": order.buyerId,
          "receiverId": order.receiverId,
          "buyerName": order.buyerName,
          "receiverName": order.receiverName,
          "buyerNumber": order.buyerNumber,
          "receiverNumber": order.receiverNumber,
          "orderId": order.orderId,
          "vendorId": order.vendorId,
          "shippingAddress": order.shippingAddress,
          "zipCode": order.zipCode,
          "optionalAddress": order.optionalAddress,
          "city":order.city,
          "province": order.province,
          "longitude": order.longitude,
          "latitude": order.latitude,
          "orderDate": order.orderDate,
          "id": order.id,
          "createdDate": order.createdDate,
          "modifiedDate": null,
          "isDeleted": order.isDeleted
        }
      },
      async akhze_sefareshe_bazargah({baseUrl,parameter}){//اخذ سفارش بازارگاه
        let res = await Axios.post(`${baseUrl}/OnlineShop/AddNewOrder`, {
          cardCode :userCardCode,
          orderId :parameter.orderId
        });
        debugger;
      },
      async walletItems({baseUrl,fixDate,parameter}){
        let { userCardCode }  = getState();
        let res = await Axios.post(`${baseUrl}/BOne/UserTransaction`, {
          "requests": [
              {
                  "cardCode": userCardCode,
                  "startDate": parameter===false ? "" : `${parameter.gregorian[0]}/${parameter.gregorian[1]}/${parameter.gregorian[2]}`,
                  // "transactionReqNo" : 1
              }
          ]
      });

      var result=res.data.data.results[0].lineDetails;
      let titleDic= {
        IncomingPayment:"واریز به کیف پول",
        OutgoingPayment:"برداشت از کیف پول"
      }

      let typeDic= {
        IncomingPayment:"in",
        OutgoingPayment:"out"
      }

      return result.map((x)=>{
        return fixDate({title:titleDic[x.realtedDoc.docType] ,date:x.date,type:typeDic[x.realtedDoc.docType] ,amount:x.sum},"date");
      });
      },
      
      
      async getCategories(obj) {
        return [];

        let { baseUrl } = obj;
        let res = await Axios.get(`${baseUrl}/Spree/GetAllCategories`);
        let dataResult = res.data.data.data;
        let included = res.data.data.included;
        let categories = dataResult.map((o) => {

          let src = nosrc;
          const imgData = o.relationships.image.data;
          // const imgIds = imgData.map((x) => x.id);
          if (imgData !== undefined && imgData != null) {
            const taxonImage = included.find(x => x.type === "taxon_image" && x.id === imgData.id)
            if (taxonImage !== undefined && taxonImage != null) {
              src = "http://shopback.bpilot.ir" + taxonImage.attributes.original_url;
            }
          }

          return { name: o.id === "10178" ? "همه محصولات" : o.attributes.name, id: o.id, src: src };
        });
        for (let i = 0; i < categories.length; i++) {
          categories[i].products = await this.getCategoryItems(obj, categories[i]);
        }
        return categories;
      },
      async getCategoryItems({ parameter, baseUrl }, category = parameter.category) {
        return await this.getTaxonProducts({ baseUrl, parameter: { Taxons: category.id.toString() } })
      },
      async families() {
        return [
          { src: undefined, name: "جنرال", id: "1" },
          { src: undefined, name: "جاینت", id: "2" },
          { src: undefined, name: "پنلی توکار", id: "3" },
        ]
      },
      async familyProducts({ baseUrl, parameter }) {
        let { id } = parameter;
        return await this.getTaxonProducts({ baseUrl, parameter: { Taxons: '10180' } })
      },
      getVariantOptionValues(optionValues, optionTypes) {
        let result = {};
        for (let optionValue of optionValues) {
          let id = optionValue.id.toString();
          for (let i = 0; i < optionTypes.length; i++) {
            let optionTypeId = optionTypes[i].id.toString()
            let items = optionTypes[i].items;
            for (let prop in items) {
              let itemId = prop.toString();
              if (id === itemId) {
                result[optionTypeId] = itemId;
              }
            }
          }
        }
        return result;
      },
      getProductVariant(include_variant, include_srcs, b1Result, optionTypes, defaultVariantId) {
        let { id, attributes, relationships } = include_variant;
        let srcs = relationships.images.data.map(({ id }) => include_srcs[id.toString()].attributes.original_url)
        const b1_item = b1Result.find((i) => i.itemCode === attributes.sku);
        let price, discountPrice, discountPercent, inStock;
        try { price = b1_item.finalPrice } catch { price = 0 }
        try { discountPercent = b1_item.pymntDscnt } catch { discountPrice = 0 }
        try { inStock = b1_item.onHand.qty } catch { inStock = 0 }
        try { discountPrice = Math.round(b1_item.price * discountPercent / 100) } catch { discountPrice = 0 }
        let optionValues = this.getVariantOptionValues(relationships.option_values.data, optionTypes)
        let code=b1_item ? b1_item.itemCode : '';
        return {
          id, optionValues, discountPrice, price, inStock, srcs,
          code,
          discountPercent,
          isDefault: defaultVariantId === id
        }
      },
      sortIncluded(spreeResult) {
        let sorted = { include_optionTypes: {}, include_details: {}, include_srcs: {}, meta_optionTypes: {}, include_variants: {} }
        for (let i = 0; i < spreeResult.included.length; i++) {
          let include = spreeResult.included[i];
          let { type, id } = include;
          id = id.toString();
          if (type === 'option_type') { sorted.include_optionTypes[id] = include }
          else if (type === 'product_property') { sorted.include_details[id] = include }
          else if (type === 'image') { sorted.include_srcs[id] = include }
          else if (type === 'variant') { sorted.include_variants[id] = include }
        }
        for (let i = 0; i < spreeResult.meta.filters.option_types.length; i++) {
          let optionType = spreeResult.meta.filters.option_types[i];
          sorted.meta_optionTypes[optionType.id.toString()] = optionType;
        }
        return sorted
      },
      getMappedAllProducts({ spreeResult, b1Result, loadType }) {

        if(loadType===0){
          
          const included=spreeResult.included;
          let finalResult =[];
          
          for (const item of spreeResult.data) {
            
            const defaultVariantId = item.relationships.default_variant.data.id;
            const defaultVariantImagesId = item.relationships.images.data.map(x=>x.id);
            const defaultVariant=included.find(x=>x.type==="variant" && x.id===defaultVariantId);
            const defaultVariantImages=included.filter(x=>x.type==="image" && defaultVariantImagesId.includes(x.id));
            const defaultVariantSku=defaultVariant.attributes.sku;
            const itemFromB1=b1Result.find(x=>x.itemCode===defaultVariantSku);
            const srcs=defaultVariantImages.map(x=>{
              return "http://shopback.bpilot.ir" + x.attributes.original_url;
            });

            if(itemFromB1==undefined) continue;

            const defaultVariantQty=itemFromB1.onHand.qty;
            finalResult.push({name:item.attributes.name,id:item.id,
                inStock:defaultVariantQty, details:[], optionTypes:[], variants:[], srcs,
                 defaultVariant:{code:defaultVariantSku,srcs},
                price:0, discountPrice:0, discountPercent:0});
          }

          return finalResult;
        }

        let products = spreeResult.data;
        let { include_optionTypes, include_variants, include_details, include_srcs, meta_optionTypes } = this.sortIncluded(spreeResult);
        var finalResult = [];
        for (let product of products) {
          let { relationships } = product;
          let optionTypes = [];
          for (let i = 0; i < relationships.option_types.data.length; i++) {
            let { id } = relationships.option_types.data[i];
            id = id.toString();
            if (!meta_optionTypes[id]) {
              console.error(`in product by id = ${product.id} in relationships.option_types.data[${i}] id is ${id}. but we cannot find this id in meta.filters.option_values`)
              console.log('product is', product)
              console.log('meta.filters.option_values is', meta_optionTypes)
              continue;
            }
            let { option_values } = meta_optionTypes[id];
            let { attributes } = include_optionTypes[id];
            let items = {}
            for (let j = 0; j < option_values.length; j++) {
              let o = option_values[j];
              items[o.id.toString()] = o.presentation;
            }
            optionTypes.push({ id, name: attributes.name, items })
          }
          let details = [];
          for (let i = 0; i < relationships.product_properties.data.length; i++) {
            let detail = relationships.product_properties.data[i];
            let { id } = detail;
            id = id.toString();
            let { attributes } = include_details[id];
            let { name, value } = attributes;
            details.push([name, value])
          }
          let srcs = [];
          for (let i = 0; i < relationships.images.data.length; i++) {
            let { id } = relationships.images.data[i];
            id = id.toString();
            let { attributes } = include_srcs[id];
            let { original_url } = attributes;
            srcs.push("http://shopback.bpilot.ir" + original_url)
          }
          let variants = [];
          let defaultVariant;
          let inStock = 0;
          let defaultVariantId = product.relationships.default_variant.data.id
          if (!relationships.variants.data || !relationships.variants.data.length) {
            console.error(`product width id = ${product.id} has not any varinat`)
            console.log('spree item is', product)
          }
          for (let i = 0; i < relationships.variants.data.length; i++) {
            let { id } = relationships.variants.data[i];
            id = id.toString();
            let variant = this.getProductVariant(include_variants[id], include_srcs, b1Result, optionTypes, defaultVariantId)
            if (variant.isDefault) { defaultVariant = variant }
            inStock += variant.inStock;
            variants.push(variant)
          }
          let price = 0, discountPrice = 0, discountPercent = 0;
          if (defaultVariant) {
            price = defaultVariant.price;
            discountPrice = defaultVariant.discountPrice;
            discountPercent = defaultVariant.discountPercent;
          }
          else {
            console.error(`product width id = ${product.id} has not default variant`)
            console.log('spree item is', product)
          }
          finalResult.push({
            inStock, details, optionTypes, variants, srcs, name: product.attributes.name, defaultVariant,
            price, discountPrice, discountPercent, id: product.id
          })
        }
        return finalResult;
      },
      async sendToVisitor({ baseUrl, getState }) {
        let { userInfo, cart = {} } = getState();
        let variants = Object.keys(cart).map((id) => cart[id])
        let res = await Axios.post(`${baseUrl}/BOne/AddNewOrder`, {
          "marketdoc": {
            "docsource": 0,
            "approvalstatus": 0,
            "doctype": 23,
            "cardcode": userInfo.cardCode,
            "marketinglines": variants.map((i) => {
              return { itemcode: i.variant.code, itemqty: i.count }
            }),
            "deliveraddress": userInfo.address,
            "marketingdetails": {
              "invtype": 1,
              "settletype": 1,
              "paymenttime": 2,
              "slpcode": userInfo.slpcode,
              "deliverytype": 13,
              "payduedate": 1
            },
            "paymentdetails": {
              "realpayerinfo": ""
            },
            "comment": "",
            "documenttotal": 0.0,
            "relatedteam": 1
          }

        });

        try { return res.data.data[0].docNum }
        catch { return false }
      },
      async getProductFullDetail({baseUrl,parameter}){

        //پروداکت رو همینجوری برای اینکه یک چیزی ریترن بشه فرستادم تو از کد و آی دی آبجکت کامل پروداکت رو بساز و ریترن کن
        let {code,id,product} = parameter;
        console.log(product)
        let res = await Axios.post(`${baseUrl}/Spree/Products`,
              {
                Ids: id,
                Include: "variants,option_types,product_properties,images"
              }
            );

        if(res.data.data.status === 500){
          return false
        }

        const productResult=res.data.data.data[0];
        if(productResult==undefined)
          return {};

        const included = res.data.data.included;
        let { relationships } = productResult;
        let {fixPrice} = getState();
        let variants = [];
        let details = [];
        let optionTypes = [];
        const defaultVariantId=product.defaultVariant.code;
        let { include_optionTypes, include_variants, include_details, include_srcs, meta_optionTypes } = this.sortIncluded(res.data.data);
        
        for (let i = 0; i < relationships.option_types.data.length; i++) {
          let { id } = relationships.option_types.data[i];
          id = id.toString();
          if (!meta_optionTypes[id]) {
            console.error(`in product by id = ${product.id} in relationships.option_types.data[${i}] id is ${id}. but we cannot find this id in meta.filters.option_values`)
            console.log('product is', product)
            console.log('meta.filters.option_values is', meta_optionTypes)
            continue;
          }
          let { option_values } = meta_optionTypes[id];
          let { attributes } = include_optionTypes[id];
          let items = {}
          for (let j = 0; j < option_values.length; j++) {
            let o = option_values[j];
            items[o.id.toString()] = o.presentation;
          }
          optionTypes.push({ id, name: attributes.presentation, items })
        }

        for (const item of relationships.variants.data) {
          const variant = included.find(x=>x.type==="variant" && x.id===item.id);
          let varId = variant.id.toString();
          let varSku = variant.attributes.sku;
          let optionValues = this.getVariantOptionValues(variant.relationships.option_values.data, optionTypes)
          const variantImagesId = variant.relationships.images.data.map(x=>x.id);
          const variantImages=included.filter(x=>x.type==="image" && variantImagesId.includes(x.id));
          const srcs=variantImages.map(x=>{
            return "http://shopback.bpilot.ir" + x.attributes.original_url;
          });

          let price=fixPrice([{itemCode : varSku, itemQty : 1}])[0];
          if(price==undefined) continue;
          variants.push({
            id:varId,
            optionValues,
            inStock:price.OnHand !== null?price.OnHand.qty:0,
            srcs,
            code:varSku,
            isDefault: defaultVariantId === varId,
            ...price
          });
        }
        
        for (let i = 0; i < relationships.product_properties.data.length; i++) {
          let detail = relationships.product_properties.data[i];
          let { id } = detail;
          id = id.toString();
          let { attributes } = include_details[id];
          let { name, value } = attributes;
          details.push([name, value])
        }

        product.details = details;
        product.variants = variants;
        product.optionTypes = optionTypes;
        console.log(product);
        return product;
      },
      async buy_search({ parameter, getState }) {
        if (!parameter.value) { return [] }
        let { allProducts } = getState();
        let result = [];
        for (let prop in allProducts) {
          if (allProducts[prop].name.indexOf(parameter.value) !== -1) {
            result.push(allProducts[prop])
          }
        }
        return result
      },
      // New Services
      async getTaxonsById(obj) {
        const ids = "10180,10550,10179,10178,10302";
        let { baseUrl } = obj;
        let res = await Axios.get(`${baseUrl}/Spree/GetTaxonsById?ids=${ids}`);
        let dataResult = res.data.data.data;
        let included = res.data.data.included;

        let categories = dataResult.map((o) => {

          let src = nosrc;
          const imgData = o.relationships.image.data;
          // const imgIds = imgData.map((x) => x.id);
          if (imgData !== undefined && imgData != null) {
            const taxonImage = included.find(x => x.type === "taxon_image" && x.id === imgData.id)
            if (taxonImage !== undefined && taxonImage != null) {
              src = "http://shopback.bpilot.ir" + taxonImage.attributes.original_url;
            }
          }

          return { name: o.id === "10178" ? "همه محصولات" : o.attributes.name, id: o.id, src: src };
        });

        return categories;
      },
      async getGuaranteesImages({ baseUrl,parameter }) {
        let res = await Axios.get(`${baseUrl}/Guarantee/GetGuaranteesImages?ids=${parameter}`); // itemCodes => itemCode of products, seprtaed by comma
        try{
          return res.data.data || []
        }
        catch{
          return []
        }
        //response
        // var res=[{"ItemCode":"3254","ImagesUrl":"http://link.com"}]
      },
      async refreshB1Rules({ baseUrl }) {
        await Axios.get(`${baseUrl}/BOne/RefreshRules`);
      },
      async refreshB1CentralInvetoryProducts({ baseUrl }) {
        await Axios.get(`${baseUrl}/BOne/RefreshCentralInvetoryProducts`);
      },
      async getTaxonProducts({ baseUrl, parameter = {} }) {
        let loadType=parameter.type;
        let res = await Axios.post(`${baseUrl}/Spree/Products`,
          {
            CardCode: userCardCode,
            //Taxons: "10179",
            Taxons: parameter.Taxons,
            Name: parameter.Name,
            Include: loadType === 0 ? "default_variant,images" : "variants,option_types,product_properties,taxons,images,default_variant"
          }
        );

        if(res.data.data.status === 500){
          return false
        }
        // const included = res.data.data.included;

        // let skusId = [];

        // for (let includeItem of included) {

        //   if (includeItem.type === "variant"
        //     && includeItem.attributes != undefined
        //     && includeItem.attributes.sku != undefined
        //     && includeItem.attributes.sku.length) {
        //     skusId.push(includeItem.attributes.sku);
        //   }
        // }
        // if(!skusId.length === 0){return}

        // let b1Res = await Axios.post(`${baseUrl}/BOne/GetB1PriceList`,
        //   {
        //     "CardCode": userCardCode,
        //     "ItemCode": skusId // should be an array
        //   });

        const {b1Info} = getState();
        const spreeData = res.data.data;
        // const b1Data = b1Res.data.data;
        const b1Data = b1Info.itemPrices.map((i)=>{
          const onHand=i.inventory.filter(x=>x.whsCode==="01");
          return {
            "itemCode": i.itemCode,
            "price": 0,
            "finalPrice": 0,
            "b1Dscnt": 0,
            "cmpgnDscnt": 0,
            "pymntDscnt": 0,
            "onHand":onHand.length ? onHand[0] : {},
            //   "onHand": {
            //   "whsCode": "01",
            //   "qty": 269.3,
            //   "qtyLevel": 300,
            //   "qtyLevRel": "Less"
            // }
          };
        });
        return this.getMappedAllProducts({ spreeResult: spreeData, b1Result: b1Data, loadType });
      },
      async getProductsWithCalculation({ baseUrl }, skusId) {
        let res = await Axios.post(`${baseUrl}/BOne/GetItemsByItemCode`,
          {
            "CardCode": userCardCode,
            "ItemCode": skusId // should be an array
          }
        );

        const included = res.data.data.included;

        return res;
      }
    }
  }
  return Service({
    services: fn(),
    baseUrl: 'https://localhost:44339/api/v1',
    // baseUrl:'https://localhost:44339/api/v1',
    getState,
    cacheAll: true
  })
}



function Service({ services, baseUrl, getState, cacheAll }) {
  let d = dateCalculator();
  function fixDate(obj, field) {
    let date = obj[field];
    try {
      if (date.indexOf("T") !== -1) {
        let time = date.split("T")[1];
        obj._time = time.split(".")[0];
      } else {
        let time = date.split(" ")[1];
        obj._time = time;
      }
    } catch {
      obj._time = undefined;
    }
    try {
      obj[field] = d.gregorianToJalali(date).join("/");
    } catch {
      obj[field] = "";
    }
    return obj;
  }
  function fix(list, { convertDateFields = [], convertArabicFields = [] }) {
    return list.map((o) => {
      for (let i = 0; i < convertDateFields.length; i++) {
        fixDate(o, convertDateFields[i]);
      }
      for (let i = 0; i < convertArabicFields.length; i++) {
        try {
          o[convertArabicFields[i]] = o[convertArabicFields[i]]
            .replace(/ك/g, "ک")
            .replace(/ي/g, "ی");
        } catch {
          o[convertArabicFields[i]] = "";
        }
      }
      return o;
    });
  }
  function getFromCache(key, minutes) {
    if (minutes === true) { minutes = Infinity }
    let storage = localStorage.getItem(key);
    if (storage === undefined || storage === null) { return false }
    let { time, data } = JSON.parse(storage);
    if ((new Date().getTime() / 60000) - (time / 60000) > minutes) { return false }
    return data;
  }
  function setToCache(key, data) {
    let time = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({ time, data }))
  }
  return async ({ type, parameter, loading = true, cache, cacheName }) => {
    let p = { fix, fixDate, parameter, dateCalculator: d, getState, baseUrl, services }
    if (loading) {$(".loading").css("display", "flex"); }
    if (cache) {
      let a = getFromCache(cacheName ? 'storage-' + cacheName : 'storage-' + type, cache);
      if (a !== false) {
        $(".loading").css("display", "none");
        return a
      }
      if (!services[type]) {debugger;}
      let result = await services[type](p);
      $(".loading").css("display", "none");
      setToCache(cacheName ? 'storage-' + cacheName : 'storage-' + type, result);
      return result;
    }
    if (!services[type]) {  debugger}

    let result = await services[type](p);
    $(".loading").css("display", "none");
    return result;
  }
}