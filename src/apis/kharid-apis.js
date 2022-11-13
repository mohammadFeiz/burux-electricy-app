import Axios from "axios";
import bulb10w from './../images/10w-bulb.png';
import nosrc from './../images/no-src.png';
export default function kharidApis({getState,token,getDateAndTime,showAlert}) {
  let baseUrl = 'https://retailerapp.bbeta.ir/api/v1';
  let {userCardCode} = getState();
  return {
    async peygiriye_sefareshe_kharid() {
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
          let {date,time} = getDateAndTime(item.docTime)
          dict[o.docStatus].push({
            docType: item.docType, isDraft: item.isDraft, docEntry: item.docEntry, date,_time:time, total: item.documentTotal
          });
        }
      }
      return dict
      //return {visitorWait,factored,inProcess,inShopTrack,delivered,canceled,rejected};
    },
    async ordersHistory() {
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
          let {date,time} = getDateAndTime(product.mainDocDate);
          orders.push(
            {
              code: product.mainDocEntry,
              mainDocNum:product.mainDocNum,
              mainDocisDraft: product.mainDocisDraft,
              mainDocType: product.mainDocType,
              date,_time:time,
              total: product.mainDocTotal, tabId: id
            }
          )
        }
      }
      return { tabs, orders };
    },
    async orderProducts(order) {
      let { userInfo } = getState();

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
            
      let Skus = [];
      console.log(result)
      const products = result.marketingLines.map((i) => {
        Skus.push(i.itemCode)
        return {
          name: i.itemName,itemCode: i.itemCode, discountPrice: i.priceAfterVat, dicountPercent: i.discountPercent, price: i.price, count: i.itemQty, src: bulb10w,
          details: []
        };
      })
      
      let srcs = await Axios.post(`${baseUrl}/Spree/Products`, { 
        Skus:Skus.toString(),
        PerPage:250,
        Include: "default_variant,images" });
      const included=srcs.data.data.included;

      for (const item of srcs.data.data.data) {
        
        const defaultVariantId = item.relationships.default_variant.data.id;
        const defaultVariantImagesId = item.relationships.images.data.map(x=>x.id);
        const defaultVariant=included.find(x=>x.type==="variant" && x.id===defaultVariantId);
        const defaultVariantImages=included.filter(x=>x.type==="image" && defaultVariantImagesId.includes(x.id));
        const defaultVariantSku=defaultVariant.attributes.sku;
        if(!defaultVariantSku){
          console.error('there is an item without sku');
          console.error('items is:',item)
          continue
        }
        const srcs=defaultVariantImages.map(x=>{
          return "https://shopback.miarze.com" + x.attributes.original_url;
        });
        let firstItem = products.find(x=>x.itemCode === defaultVariantSku);
        if(firstItem === null || firstItem === undefined) continue;
        firstItem.src=srcs[0];
      }

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
    async joziatepeygiriyesefareshekharid(order) {
      let { userInfo } = getState();
      let res = await Axios.post(`${baseUrl}/BOne/GetDocument`, {
        "docentry": order.docEntry,
        "DocType": order.docType,
        "isDraft": order.isDraft
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


      

      let {date,time} = getDateAndTime(result.docTime);
      result = {
        number: order,//
        date,_time:time,
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
      debugger;
      return result;
    },
    async userInfo() {
      let res = await Axios.post(`${baseUrl}/BOne/GetCustomer`, { "DocCode": userCardCode });

      if(res.status===401){
        return false;
      }

      try { res = res.data.data.customer }
      catch { res = {} }
      return res
    },
    async getCampaigns() {
      let res = await Axios.get(`${baseUrl}/Spree/GetAllCampaigns`);
      let result = res.data.data.data;
      return result.map((o) => { return { name: o.attributes.name, id: o.id } });
    },
    async getCampaignProducts(campaign) {
      let { id } = campaign;
      let res = await this.getTaxonProducts({ Taxons: id, loadType:0 })
      return getState().updateProductPrice(res.map((o) => { return { ...o, campaign } }),'kharidApis => getCampaignProducts')
    },
    async lastOrders() {
      const taxonProductsList=await this.getTaxonProducts({Taxons:'10179'});
      return getState().updateProductPrice(taxonProductsList,'kharidApis => lastOrders');
    },
    async recommendeds() {
      let res = await this.getTaxonProducts({Taxons:'10550'})
      return getState().updateProductPrice(res,'kharidApis => recommendeds')
    },
    async bestSellings(){
      return getState().updateProductPrice(await this.getTaxonProducts({Taxons:'10820'}),'kharidApis => bestSellings')
    },
    async preOrders() {
      let preOrders = { waitOfVisitor: 0, waitOfPey: 0 };
      let res = await Axios.post(`${baseUrl}/Visit/PreOrderStat`, { CardCode: userCardCode });
      if (!res || !res.data || !res.data.data) {
        console.error('kharidApis.preOrders Error!!!')
        return preOrders;
      }
      let result = res.data.data;
      for (let i = 0; i < result.length; i++) {
        if (result[i].Status === 1) { preOrders.waitOfVisitor = result[i].Count; }
        if (result[i].Status === 2) { preOrders.waitOfPey = result[i].Count; }
      }
      return preOrders;
    },
    async search(searchValue) {
      let res = await Axios.post(`${baseUrl}/Spree/Products`, { 
        Name: searchValue,
        PerPage:250,
        Include: "images" });
      let result = res.data.data.data;
      let included = res.data.data.included;
      return result.map((o) => {
        let src;
        try {
          let imgId = o.relationships.images.data[0].id;
          src = included.filter((m) => m.id === imgId)[0].attributes.original_url;
        }
        catch { src = ""; }
        return { name: o.attributes.name, price: o.attributes.price, unit: "", src: `https://shopback.miarze.com${src}`, discountPercent: 0, discountPrice: 0 };
      });
    },
    async getCategories() {
      let res = await Axios.get(`${baseUrl}/Spree/GetAllCategoriesbyIds?ids=10820,10179,10928,10550`);
      let dataResult = res.data.data.data;
      let included = res.data.data.included;
      let categories = dataResult.map((o) => {

        let src = nosrc;
        const imgData = o.relationships.image.data;
        // const imgIds = imgData.map((x) => x.id);
        if (imgData !== undefined && imgData != null) {
          const taxonImage = included.find(x => x.type === "taxon_image" && x.id === imgData.id)
          if (taxonImage !== undefined && taxonImage != null) {
            src = "https://shopback.miarze.com" + taxonImage.attributes.original_url;
          }
        }

        return { name: o.attributes.name, id: o.id, src: src };
      });
      for (let i = 0; i < categories.length; i++) {
        categories[i].products = await this.getCategoryItems(categories[i]);
      }
      return categories;
    },
    async getCategoryItems(category) {
      let items = await this.getTaxonProducts({ Taxons: category.id.toString() });
      return getState().updateProductPrice(items,'kharidApis => getCategoryItems')
    },
    async families() {
      return [
        { src: undefined, name: "جنرال", id: "1" },
        { src: undefined, name: "جاینت", id: "2" },
        { src: undefined, name: "پنلی توکار", id: "3" },
      ]
    },
    async familyProducts({ id }) {
      return await this.getTaxonProducts({ Taxons: '10180' })
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
    getProductVariant(include_variant, include_srcs, b1Result, optionTypes, defaultVariantId,product) {
        let { id, attributes, relationships } = include_variant;
      let srcs = relationships.images.data.map(({ id }) => include_srcs[id.toString()].attributes.original_url)
      const b1_item = b1Result.find((i) => i.itemCode === attributes.sku);
      if(!b1_item){
        return false
      }
      let price, discountPrice, discountPercent, inStock;
      try { price = b1_item.finalPrice } catch { price = 0 }
      try { discountPercent = b1_item.pymntDscnt } catch { discountPrice = 0 }
      try { inStock = b1_item.onHand.qty } catch { inStock = 0 }
      try { discountPrice = Math.round(b1_item.price * discountPercent / 100) } catch { discountPrice = 0 }
      let optionValues = this.getVariantOptionValues(relationships.option_values.data, optionTypes)
      let code = '';
      if(b1_item && b1_item.itemCode){code = b1_item.itemCode}
      else {
        console.error(`missing itemCode`)
        console.error('product is : ' ,product);
        console.error('b1_item is :', b1_item);
      }
      return {
        id, optionValues, discountPrice, price, inStock, srcs,
        code,
        discountPercent,
        isDefault: defaultVariantId === id
      };
   
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
          if(!defaultVariantSku){
            console.error('there is an item without sku');
            console.error('items is:',item)
            continue
          }
          const itemFromB1=b1Result.find(x=>x.itemCode===defaultVariantSku);
          const srcs=defaultVariantImages.map(x=>{
            return "https://shopback.miarze.com" + x.attributes.original_url;
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

        if (!relationships.variants.data || !relationships.variants.data.length) {
          console.error(`product width id = ${product.id} has not any varinat`)
          console.log('spree item is', product);
          continue;
        }
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
        if(!optionTypes.length){continue}
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
          srcs.push("https://shopback.miarze.com" + original_url)
        }
        let variants = [];
        let defaultVariant;
        let inStock = 0;
        let defaultVariantId = product.relationships.default_variant.data.id;
        for (let i = 0; i < relationships.variants.data.length; i++) {
          let { id } = relationships.variants.data[i];
          id = id.toString();
          let variant = this.getProductVariant(include_variants[id], include_srcs, b1Result, optionTypes, defaultVariantId,product)
          if(variant === false){continue}
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
          console.log('spree item is', product);
          continue;
        }
        finalResult.push({
          inStock, details, optionTypes, variants, srcs, name: product.attributes.name, defaultVariant,
          price, discountPrice, discountPercent, id: product.id
        })
      }
      return finalResult;
    },
    // {
    //   "marketdoc":{
    //     "CardCode":userCardCode,
    //     "CardGroupCode": b1Info.customer.groupCode,
    //     "MarketingLines":cartItems.map((o)=>{
    //       return { ItemCode: o.variant.code, ItemQty: o.count }
    //     }),
    //     "DeliverAddress":address,
    //     "marketingdetails":{
    //       SettleType,
    //       PaymentTime,
    //       DeliveryType,
    //       PayDueDate
    //     }
    //   }
    // }
    async sendToVisitor(obj) {
      console.log(obj)
      let res = await Axios.post(`${baseUrl}/BOne/AddNewOrder`, obj);
      try { return res.data.data[0].docEntry }
      catch { return false }
    },
    async getProductFullDetail({id,code,product}){

      //پروداکت رو همینجوری برای اینکه یک چیزی ریترن بشه فرستادم تو از کد و آی دی آبجکت کامل پروداکت رو بساز و ریترن کن
      let res = await Axios.post(`${baseUrl}/Spree/Products`,
            {
              Ids: id,
              PerPage:250,
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
          return "https://shopback.miarze.com" + x.attributes.original_url;
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
    async refreshB1Rules() {
      await Axios.get(`${baseUrl}/BOne/RefreshRules`);
    },
    async refreshB1CentralInvetoryProducts() {
      await Axios.get(`${baseUrl}/BOne/RefreshCentralInvetoryProducts`);
    },
    async getTaxonProducts({ loadType,Taxons,Name,msf }) {
      let res = await Axios.post(`${baseUrl}/Spree/Products`,
        {
          CardCode: userCardCode,
          Taxons,
          PerPage:250,
          Name,
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
    async getProductsWithCalculation(skusId) {
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