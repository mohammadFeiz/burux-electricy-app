import Axios from "axios";
import dateCalculator from "./utils/date-calculator";
import $ from "jquery";
import src1 from './utils/brx66.png';
import bulb10w from './images/10w-bulb.png';
export default async function services(type, parameter, loading = true) {
  let d = dateCalculator();
  let $$ = {
    fixDate(obj, field) {
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
    },
    fix(list, { convertDateFields = [], convertArabicFields = [] }) {
      return list.map((o) => {
        for (let i = 0; i < convertDateFields.length; i++) {
          $$.fixDate(o, convertDateFields[i]);
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
    },
    async kalahaye_garanti_shode() {
      let res = await Axios.post(
        "https://retailerapp.bbeta.ir/api/v1/Guarantee/GetAllGuarantees",
        { CardCode: "C50000" }
      );
      if (res.data && res.data.isSuccess) {
        return $$.fix(res.data.data.Items, {
          convertDateFields: ["CreateTime"],
        });
      } else {
        return [];
      }
    },
    async kalahaye_mojoode_garanti() {
      let res = await Axios.get(
        "https://retailerapp.bbeta.ir/api/v1/Guarantee/GetAllProducts"
      );
      if (res.data && res.data.isSuccess) {
        return res.data.data;
      } else {
        return [];
      }
    },
    async sabte_kalahaye_garanti(Items) {
      let res = await Axios.post(
        "https://retailerapp.bbeta.ir/api/v1/Guarantee",
        { CardCode: "C50000", Items }
      );
      if (res.data && res.data.isSuccess) {
        return true;
      } else {
        return false;
      }
    },
    async get_all_awards() {
      let res = await Axios.get("https://retailerapp.bbeta.ir/api/v1/Awards");
      if (res.data && res.data.isSuccess) {
        return res.data.data;
      } else {
        return [];
      }
    },
    async get_tested_chance() {
      let today = d.getToday("jalali");
      let date = [1401, 1, 1];
      //let date = today;
      return (
        `${today[0]},${today[1]},${today[2]}` ===
        `${date[0]},${date[1]},${date[2]}`
      );
    },
    async save_catched_chance(award) {
      let res = await Axios.post(
        "https://retailerapp.bbeta.ir/api/v1/UserAwards",
        { UserId: 1, AwardId: award.award.id, Win: award.result }
      );
      return res.data.isSuccess;
    },
    async get_user_awards() {
      let res = await Axios.get(
        "https://retailerapp.bbeta.ir/api/v1/UserAwards"
      );
      if (res.data && res.data.isSuccess) {
        let list = res.data.data.map((o) => {
          return {
            title: o.award.title,
            subtitle: o.award.shortDescription,
            date: o.createdDate,
            used: o.usedDate !== null,
            code: o.id,
          };
        });
        return $$.fix(list, { convertDateFields: ["date"] });
      } else {
        return [];
      }
    },

    async peygiriye_sefareshe_kharid() {
      let res = await Axios.post(
        "https://retailerapp.bbeta.ir/api/v1/Visit/GetAllUserPreOrder",
        {
          CardCode: "c50000",
          Page: 1,
        }
      );
      let result = res.data.data.Items;
      let visitorWait = [];
      let factored = [];
      let inProcess = [];
      let inShopTrack = [];
      let delivered = [];
      let canceled = [];
      let rejected = [];
      for (let i = 0; i < result.length; i++) {
        let o = result[i];
        if (o.Status === 1) {
          visitorWait.push({
            number: o.ID,
            date: o.Time,
            total: o.TotalPrice,
            items: o.Items.map((item) => {
              return {
                name: item.ProductName,
                Qty: item.Count,
              };
            }),
          });
        }
        if (o.Status === 2) {
          factored.push({
            number: o.ID,
            date: o.Time,
            total: o.TotalPrice,
            items: o.Items.map((item) => {
              return {
                name: item.ProductName,
                Qty: item.Count,
              };
            }),
          });
        }
      }
      return {
        visitorWait,
        factored,
        inProcess,
        inShopTrack,
        delivered,
        canceled,
        rejected,
      };
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
    async joziatepeygiriyesefareshekharid(id) {
      let res = await Axios.post(
        "https://retailerapp.bbeta.ir/api/v1/Visit/PreOrderDetails",
        { OrderId: id }
      );
      let result = res.data.data;
      result = {
        number: id,
        date: result.Time,
        customerName: result.CustomerName,
        customerCode: result.CardCode,
        customerGroup: result.StoreBranch,
        campain: result.CampaignName,
        basePrice: "نداریم",
        visitorName: "نداریم",
        address: "نداریم",
        mobile: "نداریم",
        phone: "نداریم",
        total: result.TotalPrice,
        paymentMethod: result.DeliveryType,
        items: result.Items.map((o) => {
          return {
            name: o.ProductName,
            count: o.Count,
            color: "آفتابی",
            discountPrice: 0,
            discountPercent: 0,
            unit: "",
            price: o.MinPrice,
            src:src1
          };
        }),
      };

      return result;
    },
    async getCampaigns() {
      let res = await Axios.get(
        "https://retailerapp.bbeta.ir/api/v1/Spree/GetAllCampaigns"
      );
      let result = res.data.data.data;
      // result = result.filter((o) => {
      //   return o.id.toString() === "10178" || o.id.toString() === "10181";
      // });
      return result.map((o) => {
        return {
          name: o.attributes.name,
          id: o.id,
          background: "#FDB913",
          color: "#173796",
          src:bulb10w
        };
      });
    },
    async activeCampaignItems({campaign,allProducts,count}) {
      let products = Object.keys(allProducts);
      if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
      return products.map((o) =>{return {...allProducts[o.toString()],campaign}})
    },
    async lastOrders({allProducts,count}) {
      let products = Object.keys(allProducts);
      if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
      return products.map((o) =>allProducts[o.toString()])
    },
    async recommendeds({allProducts,count}) {
      let products = Object.keys(allProducts);
      if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
      return products.map((o) =>allProducts[o.toString()])
    },
    async bestCellings({allProducts,count}){
      let products = Object.keys(allProducts);
      if(count !== undefined){products = products.slice(0,Math.min(count,products.length))}
      return products.map((o) =>allProducts[o.toString()])
    },
    async preOrders() {
      let res = await Axios.post(
        `https://retailerapp.bbeta.ir/api/v1/Visit/PreOrderStat`,
        {
          CardCode: "c50000",
        }
      );
      let result = res.data.data;
      let preOrders = {
        waitOfVisitor: 10,
        waitOfPey: 2,
      };
      for (let i = 0; i < result.length; i++) {
        if (result[i].Status === 1) {
          preOrders.waitOfVisitor = result[i].Count;
        }
        if (result[i].Status === 2) {
          preOrders.waitOfPey = result[i].Count;
        }
      }
      return preOrders;
    },
    async search(searchValue) {
      let res = await Axios.post(
        `https://retailerapp.bbeta.ir/api/v1/Spree/Products`,
        {
          Name: searchValue,
          Include: "images",
        }
      );
      let result = res.data.data.data;
      let included = res.data.data.included;
      return result.map((o) => {
        let src;
        try {
          let imgId = o.relationships.images.data[0].id;
          src = included.filter((m) => m.id === imgId)[0].attributes
            .original_url;
        } catch {
          src = "";
        }
        return {
          name: o.attributes.name,
          price: o.attributes.price,
          unit: "",
          src: `http://spree.burux.com${src}`,
          discountPercent: 0,
          discountPrice: 0,
        };
      });
    },
    async getCategories() {
      return []
      let res = await Axios.get(
        `https://retailerapp.bbeta.ir/api/v1/Spree/GetAllCategories`
      );
      let included = res.data.data.included;
      let categories = included.map((o) => {
        return {
          name: o.attributes.name,
          id: o.id,
        };
      });
      for (let i = 0; i < categories.length; i++) {
        let o = categories[i];
        let res = await Axios.post(
          `https://retailerapp.bbeta.ir/api/v1/Spree/Products`,
          {
            Include: "images",
            Taxons: o.id.toString(),
          }
        );
        let items = res.data.data.data;
        let included = res.data.data.included;
        o.items = items.map((item) => {
          let imgId = item.relationships.images.data[0].id;
          let src = included.filter((m) => m.id === imgId)[0].attributes
            .original_url;
          return {
            name: item.attributes.name,
            price: item.attributes.price,
            discountPercent: 0,
            discountPrice: 0,
            src: `http://spree.burux.com${src}`,
          };
        });
      }
      return categories;
    },
    async families(){
      return [
        { src: src1, name: "جنرال", id: "1" },
        { src: src1, name: "جاینت", id: "2" },
        { src: src1, name: "پنلی توکار", id: "3" },
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
            if (imgData.length) {
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
                  ? b1_item.priceAfterCalculate
                  : includeItem.attributes.price; // int

              const variant_discount_price =
                b1_item !== undefined && b1_item !== null
                  ? b1_item.priceAfterVat
                  : includeItem.attributes.price; // int

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
    async getAllProducts() {
      let res = localStorage.getItem("electricyLastFetch");
      if (res === null || res === undefined) {
        res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Spree/AllProducts`,
          {
            CardCode: "c50000",
            Taxons: "10181,10178,10182",
            Include: "variants,option_types,product_properties,taxons,images,default_variant",
            IsItemPriceNeeded: true,
          }
        );
        res = $$.getMappedAllProducts(res.data.data);
        localStorage.setItem("electricyLastFetch", JSON.stringify(res));
      } else {
        res = JSON.parse(res);
      }
      return res;
    }
  };
  if (loading) {
    $(".loading").css("display", "flex");
  }
  let result = await $$[type](parameter);
  $(".loading").css("display", "none");
  return result;
}
