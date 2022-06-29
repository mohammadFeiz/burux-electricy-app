import Axios from "axios";
import dateCalculator from "./utils/date-calculator";
import $ from "jquery";
import bulb10w from './images/10w-bulb.png';
import nosrc from './images/no-src.png';
export default function services(getState) {
  let fn = function(){
    return {
      async kalahaye_garanti_shode({fix,baseUrl}) {
        let res = await Axios.post(`${baseUrl}/Guarantee/GetAllGuarantees`,{ CardCode: "C50000" });
        if (res.data && res.data.isSuccess) {
          return fix(res.data.data.Items, {convertDateFields: ["CreateTime"]});
        } 
        else {return [];}
      },
      async kalahaye_mojoode_garanti({baseUrl}) {
        let res = await Axios.get(`${baseUrl}/Guarantee/GetAllProducts`);
        return res.data && res.data.isSuccess?res.data.data:[];
      },
      async sabte_kalahaye_garanti({baseUrl,parameter}) {
        let res = await Axios.post(`${baseUrl}/Guarantee`,{ CardCode: "C50000", Items:parameter });
        return !!res.data && !!res.data.isSuccess
      },
      async get_all_awards({baseUrl}) {
        let res = await Axios.get(`${baseUrl}/Awards`);
        return res.data && res.data.isSuccess?res.data.data:[];
      },
      async get_tested_chance({dateCalculator}) {
        let today = dateCalculator.getToday("jalali"),date = [1401, 1, 1];
        return (`${today[0]},${today[1]},${today[2]}` === `${date[0]},${date[1]},${date[2]}`);
      },
      async save_catched_chance({parameter,baseUrl}) {
        let res = await Axios.post(`${baseUrl}/UserAwards`,{ UserId: 1, AwardId: parameter.award.id, Win: parameter.result });
        return res.data.isSuccess;
      },
      async get_user_awards({fix,baseUrl}) {
        let res = await Axios.get(`${baseUrl}/UserAwards`);
        if (res.data && res.data.isSuccess) {
          let list = res.data.data.map((o) => {
            return {title: o.award.title,subtitle: o.award.shortDescription,date: o.createdDate,used: o.usedDate !== null,code: o.id};
          });
          return fix(list, { convertDateFields: ["date"] });
        } 
        else {return [];}
      },
      // async peygiriye_sefareshe_kharid({baseUrl}) {
      //   let res = await Axios.post(`${baseUrl}/Visit/GetAllUserPreOrder`,{CardCode: "c50000",Page: 1});
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
      async peygiriye_sefareshe_kharid({baseUrl,fixDate}) {
        let res = await Axios.post(`${baseUrl}/BOne/GetAllOrders`,{
          "FieldName":"cardcode",  
          "FieldValue":"c50000",
          "StartDate":"2022-06-19",
          "QtyInPage":1000,
          "PageNo":1
        })
        let result = res.data.data.results;
        let dict = {};
        for (let i = 0; i < result.length; i++) {
          let o = result[i];
          if (!dict[o.orderState]) {
            dict[o.orderState] = [];
          }
          for(let j = 0; j < o.documents.length; j++){
            let item = o.documents[j];
            dict[o.orderState].push({
              docType:item.docType,isDraft:item.isDraft,docEntry:item.docEntry,date:fixDate({date:item.docTime},"date").date,total:item.documentTotal
            });
          }
        }
        return dict
        //return {visitorWait,factored,inProcess,inShopTrack,delivered,canceled,rejected};
      },
      async joziatepeygiriyesefareshekharid({baseUrl,fixDate,parameter,getState,services}) {
        let {userInfo} = getState();
        let res = await Axios.post(`${baseUrl}/BOne/GetDocument`,{
          "docentry":parameter.docEntry, 
          "DocType":parameter.docType,
          "isDraft":parameter.isDraft
        });
        let result = res.data.data.results;
        
        let total = 0,basePrice = 0,visitorName,paymentMethod;
        let {marketingLines = [],marketingdetails = {},paymentdetails = {}} = result;
        visitorName = marketingdetails.slpName;
        paymentMethod = paymentdetails.paymentTermName || '';
        
        for (let i = 0; i < marketingLines.length; i++){
          let {priceAfterVat = 0,price = 0} = result.marketingLines[i];
          total += priceAfterVat;
          basePrice += price;
        }
        result = {
          number: parameter,//
          date: fixDate({date:result.docTime},"date").date,//
          customerName: result.cardName,//
          customerCode: result.cardCode,//
          customerGroup: result.cardGroupCode,//
          campain:result.marketingdetails.campaign,//
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
              src:undefined
            };
          }),
        };
  
        return result;
      },
      async wallet({baseUrl}){
        let res = await Axios.post(`${baseUrl}/BOne/CheckBallance`,{"Requests":[{"CardCode":"c50000"}]});
        try{res = res.data.data.results[0].ballance}
        catch{res = 0}
        return res
      },
      async userInfo({baseUrl}){
        let res = await Axios.post(`${baseUrl}/BOne/GetCustomer`,{"DocCode":"c50000"});
        try{res = res.data.data.customer}
        catch{res = {}}
        return res
      },
      async getCampaigns({baseUrl}) {
        let res = await Axios.get(`${baseUrl}/Spree/GetAllCampaigns`);
        let result = res.data.data.data;
        return result.map((o) => {
          return {name: o.attributes.name,id: o.id,background: "#FDB913",color: "#173796",src:bulb10w};
        });
      },
      async activeCampaignItems({parameter,getState,baseUrl}) {
        let {allProducts} = getState();
        let {campaign,count} = parameter;
        let products = Object.keys(allProducts);
        if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
        return products.map((o) =>{return {...allProducts[o.toString()],campaign}})
      },
      // async activeCampaignItems({parameter,getState,baseUrl}) {
      //   let {allProducts} = getState();
      //   let {count} = parameter;
      //   let products = Object.keys(allProducts);
      //   if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
      //   return products.map((o) =>allProducts[o.toString()])
      // },
      async lastOrders({parameter,getState}) {
        let {allProducts} = getState();
        let {count} = parameter;
        let products = Object.keys(allProducts);
        if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
        return products.map((o) =>allProducts[o.toString()])
      },
      async recommendeds({parameter,getState}) {
        let {allProducts} = getState();
        let {count} = parameter;
        let products = Object.keys(allProducts);
        if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
        return products.map((o) =>allProducts[o.toString()])
      },
      async bestSellings({parameter,getState}){
        let {allProducts} = getState();
        let {count} = parameter;
        let products = Object.keys(allProducts);
        if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
        return products.map((o) =>allProducts[o.toString()])
      },
      async preOrders({baseUrl}) {
        let res = await Axios.post(`${baseUrl}/Visit/PreOrderStat`,{CardCode: "c50000"});
        let result = res.data.data;
        let preOrders = {waitOfVisitor: 10,waitOfPey: 2,
        };
        for (let i = 0; i < result.length; i++) {
          if (result[i].Status === 1) {preOrders.waitOfVisitor = result[i].Count;}
          if (result[i].Status === 2) {preOrders.waitOfPey = result[i].Count;}
        }
        return preOrders;
      },
      async search({parameter,baseUrl}) {
        let searchValue = parameter
        let res = await Axios.post(`${baseUrl}/Spree/Products`,{Name: searchValue,Include: "images"});
        let result = res.data.data.data;
        let included = res.data.data.included;
        return result.map((o) => {
          let src;
          try {
            let imgId = o.relationships.images.data[0].id;
            src = included.filter((m) => m.id === imgId)[0].attributes.original_url;
          } 
          catch {src = "";}
          return {name: o.attributes.name,price: o.attributes.price,unit: "",src: `http://spree.burux.com${src}`,discountPercent: 0,discountPrice: 0};
        });
      },
      async getCategories(obj) {
        // let {baseUrl} = obj;
        // let res = await Axios.get(
        //   `${baseUrl}/Spree/GetAllCategories`
        // );
        // let included = res.data.data.included;
        // console.log(included);
        // let categories = included.map((o) => {
        //   return {name: o.attributes.name,id: o.id};
        // });
        // for (let i = 0; i < categories.length; i++) {
        //   categories[i].items = await this.getCategoryItems(obj,categories[i]);
        // }
        // return categories;
        let {baseUrl} = obj;
        let res = await Axios.get(
          `${baseUrl}/Spree/GetAllCategories`
        );
        let dataResult = res.data.data.data;
        let included = res.data.data.included;
        console.log(dataResult)
        
        let categories = dataResult.map((o) => {

          let src=nosrc;
          const imgData = o.relationships.image.data;
          // const imgIds = imgData.map((x) => x.id);
          if(imgData !== undefined && imgData != null){
            const taxonImage=included.find(x=>x.type==="taxon_image" && x.id===imgData.id)
            if (taxonImage !== undefined && taxonImage != null) {
              src = "http://spree.burux.com" + taxonImage.attributes.original_url;
            }
          }

          return {name: o.id==="10178" ? "همه محصولات" : o.attributes.name,id: o.id,src:src};
        });
        for (let i = 0; i < categories.length; i++) {
          categories[i].items = await this.getCategoryItems(obj,categories[i]);
        }
        return categories;
      },
      async getCategoryItems({parameter,getState,baseUrl},category = parameter.category){ 
        let { allProducts } = getState();
        let res = await Axios.post(`${baseUrl}/Spree/Products`,{Include: "images",Taxons: category.id.toString()});
        let items = res.data.data.data;
        let result = [];
        for(let i = 0; i < items.length; i++){
          let item = items[i];
          let product = allProducts[item.id]
          if(!product){continue}
          result.push(product)
        }
        return result;
      },
      async families(){
        return [
          { src: undefined, name: "جنرال", id: "1" },
          { src: undefined, name: "جاینت", id: "2" },
          { src: undefined, name: "پنلی توکار", id: "3" },
        ]
      },
      getMappedAllProducts({spreeResult,b1Result}){
        let result = spreeResult.data,included = spreeResult.included,meta = spreeResult.meta;
        var finalResult = {};
        for (let spreeItem of result) {
          let defaultVariantId;
          try{defaultVariantId = spreeItem.relationships.default_variant.data.id;}
          catch{debugger;}
          
          let spreeItemTotalVariantsCount = 0;
          let defaultVariant;
          let product_properties_included_values = [],option_types_included_values = [],variants_included_values = [],mainSrcs = [];
          for (let includeItem of included) {
            if (includeItem.type === "product_property") {
              const product_properties_data = spreeItem.relationships.product_properties.data;
              if (
                product_properties_data.length &&
                product_properties_data.map((x) => x.id).includes(includeItem.id)
              ) {
                product_properties_included_values.push([
                  includeItem.attributes.name,
                  includeItem.attributes.value,
                ]);
              }
            } else if (includeItem.type === "option_type") {
              const option_types_data = spreeItem.relationships.option_types.data;
              if (
                option_types_data.length &&
                option_types_data.map((x) => x.id).includes(includeItem.id)
              ) {
                const option_type_values_data = meta.filters.option_types
                  .find((x) => x.id.toString() === includeItem.id.toString())
                  .option_values.map((v) => {
                    return { name: v.presentation, id: v.id };
                  });
  
                option_types_included_values.push({
                  id: includeItem.id,
                  name: includeItem.attributes.name,
                  items: option_type_values_data,
                });
              }
            } else if (includeItem.type === "variant") {
              const variant_id = includeItem.id; // int
              const imgData = includeItem.relationships.images.data;
              let srcs = [];
              if (imgData.length && imgData.id!==undefined) {
                const imgIds = imgData.id;
                srcs = included.map((m) => {
                  return m.type === "image" && imgIds.includes(m.id)
                    ? m.attributes.original_url
                    : null;
                });
              }
              const variants_ids_data = spreeItem.relationships.variants.data;
              if (
                variants_ids_data.length &&
                variants_ids_data.map((x) => x.id).includes(includeItem.id)
              ) {
                const b1_item = b1Result.find(
                  (i) => i.itemCode === includeItem.attributes.sku
                );
                const variant_price =
                  b1_item !== undefined && b1_item !== null
                    ? b1_item.price
                    : 0;
                    // : includeItem.attributes.price; // int
  
                const variant_discount_price =
                  b1_item !== undefined && b1_item !== null
                    ? b1_item.priceAfterVat
                    : 0; // int
                    // : includeItem.attributes.price; // int
                //const variant_discount_precent = b1_item !== undefined ? b1_item.discountPercent : 0; // int
                const variant_in_stock = b1_item !== undefined  && b1_item !== null
                    ? b1_item.totalQty 
                    : 0;
                spreeItemTotalVariantsCount += variant_in_stock;
  
                const variant_option_values = includeItem.relationships.option_values.data; // array -> {id, type}
                let option_values_result = {};
                for (const op_val of variant_option_values) {
                  // array -> { id: p.id, name: p.attributes.name, items: [{ name: v.presentation, id: v.id }] }
                  const selected_option_type = option_types_included_values.find((x) =>x.items.map((i) => i.id.toString()).includes(op_val.id.toString()));
                  if (selected_option_type === undefined || selected_option_type === null) continue;
                  option_values_result[selected_option_type.id.toString()] = selected_option_type.items.find((ov) => ov.id.toString() === op_val.id.toString()).id;
                }
                let obj = {
                  id: variant_id,
                  code:b1_item?b1_item.itemCode:'',
                  optionValues: option_values_result,
                  discountPrice: variant_discount_price,
                  discountPercent: Math.round((variant_price - variant_discount_price) * 100 / variant_price),
                  price: variant_price,
                  inStock: variant_in_stock,
                  srcs: srcs,
                  
                }
                if(defaultVariantId === variant_id){
                  obj.isDefault = true;
                  defaultVariant = obj;
                }
                variants_included_values.push(obj);
              }
            } 
            else if (includeItem.type === "image") {
              const imgData = spreeItem.relationships.images.data;
              const imgIds = imgData.map((x) => x.id);
              if (imgData.length && imgIds.includes(includeItem.id)) {
                mainSrcs.push("http://spree.burux.com" + includeItem.attributes.original_url);
              }
            }
          }
  
          finalResult[spreeItem.id] = {
            inStock:spreeItemTotalVariantsCount,
            name: spreeItem.attributes.name,
            defaultVariant,
            code: `code_${spreeItem.id}`,
            id: spreeItem.id,
            details: product_properties_included_values,
            optionTypes: option_types_included_values,
            variants: variants_included_values,
            srcs: mainSrcs,
          };
        }
        console.log(finalResult)
        return finalResult;
      },
      async getAllProducts({baseUrl}) {
        let res = await Axios.post(`${baseUrl}/Spree/AllProducts`,
          {
            CardCode: "c50000",
            //Taxons: "10181,10178,10182",
            Taxons: "10016,10302,10178",
            // Taxons: "10180,10550,10179,10178,10302,10181",
            // PerPage:250,
            Include: "variants,option_types,product_properties,taxons,images,default_variant"
          }
        );
        return this.getMappedAllProducts(res.data.data);
      },
      async sendToVisitor({baseUrl,getState}) {
        let {userInfo,cart = {}}=getState();
        let variants = Object.keys(cart).map((id)=>cart[id])

        debugger; 
        let res = await Axios.post(`${baseUrl}/BOne/AddNewOrder`,{
          "marketdoc": {
            "docsource": 0,
            "approvalstatus": 0,
            "doctype": 17,
            "cardcode": userInfo.cardCode,
            "marketinglines": variants.map((i)=>{
              return {itemcode:i.variant.code,itemqty:i.count}
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
      },
      async buy_search({parameter,getState}){
        if(!parameter.value){return []}
        let {allProducts} = getState();
        let result = [];
        for(let prop in allProducts){
          if(allProducts[prop].name.indexOf(parameter.value) !== -1){
            result.push(allProducts[prop])
          }
        }
        return result
      }
    }
  }
  return Service({
    services:fn(),
    baseUrl:'https://retailerapp.bbeta.ir/api/v1',
    getState,
    cacheAll:true
  })
}



function Service({services,baseUrl,getState,cacheAll}){
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
  function getFromCache(key,minutes){
    if(minutes === true){minutes = Infinity}
    let storage = localStorage.getItem(key);
    if(storage === undefined || storage === null){return false}
    let {time,data} = JSON.parse(storage);
    if((new Date().getTime() / 60000) - (time / 60000) > minutes){return false}
    return data;
  }
  function setToCache(key,data){
    let time = new Date().getTime();
    localStorage.setItem(key,JSON.stringify({time,data}))
  }
  return async ({type,parameter,loading = true,cache})=>{
    let p = {fix,fixDate,parameter,dateCalculator:d,getState,baseUrl,services}
    if (loading) {$(".loading").css("display", "flex");}
    if(cache){
      let a = getFromCache('storage-' + type,cache);
      if(a !== false){
        $(".loading").css("display", "none");
        return a
      }
      if(!services[type]){debugger}
      let result = await services[type](p);
      $(".loading").css("display", "none");
      setToCache('storage-' + type,result);
      return result;        
    }
    if(!services[type]){debugger}
      
    let result = await services[type](p);
    $(".loading").css("display", "none");
    return result;
  }
}