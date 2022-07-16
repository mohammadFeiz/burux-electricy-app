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
        if (res.data && res.data.isSuccess && res.data.data) {
          return fix(res.data.data.Items, {convertDateFields: ["CreateTime"]});
        } 
        else {return [];}
        // return [];
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
      async campaignsProducts({baseUrl,parameter}){
        let {campaigns} = parameter;
        let result = {};
        for(let i = 0; i < campaigns.length; i++){
          let campaign = campaigns[i];
          let res = await this.getTaxonProducts({baseUrl,parameter:{Taxons:campaign.id}})
          res = res.map((o)=>{return {...o,campaign}})
          result[campaign.id] = res; 
        }
        return result;
      },
      async lastOrders({baseUrl}) {
        return await this.getTaxonProducts({baseUrl,parameter:{Taxons:'10180'}})
         
      },
      async recommendeds({baseUrl}) {
        return await this.getTaxonProducts({baseUrl,parameter:{Taxons:'10180'}})
        
      },
      async bestSellings({baseUrl}){
        return await this.getTaxonProducts({baseUrl,parameter:{Taxons:'10180'}})
        
      },
      async preOrders({baseUrl}) {
        let preOrders = {waitOfVisitor: 10,waitOfPey: 2};
        let res = await Axios.post(`${baseUrl}/Visit/PreOrderStat`,{CardCode: "c50000"});
        if(!res || !res.data || !res.data.data){
          console.error('API Error!!!!!')
          return preOrders;
        }
        let result = res.data.data;
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
      // getOptionTypeIdByOptionValueId(optionTypes,optionValueId){
      //   for(let i = 0; i < optionTypes.length; i++){
      //     let optionType = optionTypes[i];
      //     let {items} = optionType;
      //     for(let j = 0; j < items.length; j++){
      //       if(optionValueId.toString() === items[j].id.toString()){return {optionTypeId:optionType.id.toString(),optionTypeItemId:items[j].id.toString()}}
      //     }
      //   }
      //   return false
      // },
      getVariantOptionValues(optionValues,optionTypes){
        let result = {};
        for (let optionValue of optionValues) {
          let id = optionValue.id.toString();
          for(let i = 0; i < optionTypes.length; i++){
            let optionTypeId = optionTypes[i].id.toString()
            let items = optionTypes[i].items;
            for(let j = 0; j < items.length; j++){
              let itemId = items[j].id.toString();
              if(id === itemId){
                result[optionTypeId] = items[j].id.toString();
              }
            }
          }
        }
        return result
      },
      getProductVariant(include_variant,include_srcs,b1Result,optionTypes,defaultVariantId){
        let {id,attributes,relationships} = include_variant;
        let srcs = relationships.images.data.map(({id})=>include_srcs[id.toString()].attributes.original_url)
        const b1_item = b1Result.find((i) => i.itemCode === attributes.sku);
        let price,discountPrice,inStock;
        try { price = b1_item.price } catch { price = 0 }
        try { discountPrice = b1_item.priceAfterVat } catch { discountPrice = 0 }
        try { inStock = b1_item.totalQty } catch { inStock = 0 }
        let optionValues = this.getVariantOptionValues(relationships.option_values.data,optionTypes)
        let discountPercent = price && discountPrice?Math.round((price - discountPrice) * 100 / price):0;
        return {
          id,optionValues,discountPrice,price,inStock,srcs,
          code:b1_item?b1_item.itemCode:'',
          discountPercent,
          isDefault:defaultVariantId === id
        }
      },
      sortIncluded(spreeResult){
        let sorted = {include_optionTypes:{},include_details:{},include_srcs:{},meta_optionTypes:{},include_variants:{}}
        for(let i = 0; i < spreeResult.included.length; i++){
          let include = spreeResult.included[i];
          let {type,id} = include;
          id = id.toString();
          if(type === 'option_type'){sorted.include_optionTypes[id] = include}
          else if(type === 'product_property'){sorted.include_details[id] = include}
          else if(type === 'image'){sorted.include_srcs[id] = include}
          else if(type === 'variant'){sorted.include_variants[id] = include}
        }
        for(let i = 0; i < spreeResult.meta.filters.option_types.length; i++){
          let optionType = spreeResult.meta.filters.option_types[i];
          sorted.meta_optionTypes[optionType.id.toString()] = optionType;
        }
        return sorted
      },
      getMappedAllProducts({spreeResult,b1Result}){
        let products = spreeResult.data;
        let {include_optionTypes,include_variants,include_details,include_srcs,meta_optionTypes} = this.sortIncluded(spreeResult);
        var finalResult = [];
        for (let product of products) {
          let {relationships} = product;
          let optionTypes = [];
          for (let i = 0; i < relationships.option_types.data.length; i++){
            let {id} = relationships.option_types.data[i];
            id = id.toString();
            if(!meta_optionTypes[id]){
              console.error(`product.relationships.option_types.data[${i}] not has matched id in meta.filters.option_values (id = ${id})`)
              console.log('spree item is',product)
              console.log('meta_optionTypes is',meta_optionTypes)
              continue;
            }
            let {option_values} = meta_optionTypes[id];
            let {attributes} = include_optionTypes[id];
            optionTypes.push({id,name:attributes.name,items:option_values.map((o)=>{return {name: o.presentation, id: o.id}})})
          }
          let details = [];
          for(let i = 0; i < relationships.product_properties.data.length; i++){
            let detail = relationships.product_properties.data[i];
            let {id} = detail;
            id = id.toString();
            let {attributes} = include_details[id];
            let {name,value} = attributes;
            details.push([name,value])
          }
          let srcs = [];
          for(let i = 0; i < relationships.images.data.length; i++){
            let {id} = relationships.images.data[i];
            id = id.toString();
            let {attributes} = include_srcs[id];
            let {original_url} = attributes;
            srcs.push("http://spree.burux.com" + original_url)
          }
          let variants = [];
          let defaultVariant;
          let inStock = 0;
          let defaultVariantId = product.relationships.default_variant.data.id
          if(!relationships.variants.data || !relationships.variants.data.length){
            console.error(`product width id = ${product.id} has not any varinat`)
            console.log('spree item is',product)
          }
          for(let i = 0; i < relationships.variants.data.length; i++){
            let {id} = relationships.variants.data[i];
            id = id.toString();
            let variant = this.getProductVariant(include_variants[id],include_srcs,b1Result,optionTypes,defaultVariantId)
            if(variant.isDefault){defaultVariant = variant}
            inStock += variant.inStock;
            variants.push(variant)
          }
          let price = 0,discountPrice = 0,discountPercent = 0;
          if(defaultVariant){
            price = defaultVariant.price;
            discountPrice = defaultVariant.discountPrice;
            discountPercent = defaultVariant.discountPercent;
          }
          else{
            console.error(`product width id = ${product.id} has not default variant`)
            console.log('spree item is',product)
          }
          finalResult.push({
            inStock,details,optionTypes,variants,srcs,name: product.attributes.name,defaultVariant,
            price,discountPrice,discountPercent,id: product.id
          })
        }
        return finalResult;
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
      },

      // New Services
      async getTaxonsById(obj){
        const ids="10180,10550,10179,10178,10302";
        let {baseUrl} = obj;
        let res = await Axios.get(`${baseUrl}/Spree/GetTaxonsById?ids=${ids}`);
        let dataResult = res.data.data.data;
        let included = res.data.data.included;
        
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

        return categories;
      },
      async refreshB1Rules({baseUrl}){
        await Axios.get(`${baseUrl}/BOne/RefreshRules`);
      },
      async refreshB1CentralInvetoryProducts({baseUrl}){
        await Axios.get(`${baseUrl}/BOne/RefreshCentralInvetoryProducts`);
      },
      async getTaxonProducts({baseUrl,parameter = {}}){ 
        let res = await Axios.post(`${baseUrl}/Spree/Products`,
        {
          CardCode: "c50000",
          //Taxons: "10179",
          Taxons:parameter.Taxons,
          Include: "variants,option_types,product_properties,taxons,images,default_variant"
        }
      );
      console.log('ahmadi',res.data.data)
      const included = res.data.data.included;
      
      let skusId =[];

      for(let includeItem of included){
        
        if(includeItem.type === "variant" 
        && includeItem.attributes != undefined 
        && includeItem.attributes.sku != undefined
          && includeItem.attributes.sku.length){
          skusId.push(includeItem.attributes.sku);
        }
      }

      let b1Res = await Axios.post(`${baseUrl}/BOne/GetItemsByItemCode`,
      {
        "CardCode": "c50000",
        "ItemCode":skusId // should be an array
      });

      const spreeData=res.data.data;
      const b1Data=b1Res.data.data;
      return  this.getMappedAllProducts({spreeResult:spreeData,b1Result:b1Data});
      },
      async getProductsWithCalcolation({baseUrl},skusId){ 
        let res = await Axios.post(`${baseUrl}/BOne/GetItemsByItemCode`,
        {
          "CardCode": "c50000",
          "ItemCode":skusId // should be an array
        }
      );
      
      const included = res.data.data.included;
      
        console.log(res.data)
        return res;
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