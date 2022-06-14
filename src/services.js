import Axios from "axios";
import dateCalculator from "./utils/date-calculator";
import $ from "jquery";
import axios from "axios";
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
      debugger;
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
            Qty: o.Count,
            color: "آفتابی",
            discountPrice: 0,
            discountPercent: 0,
            unit: "",
            price: o.MinPrice,
          };
        }),
      };

      return result;
    },
    async getCampaigns() {
      let res = await Axios.get(
        "https://retailerapp.bbeta.ir/api/v1/Spree/GetAllCampaigns"
      );
      let result = res.data.data.included;
      result = result.filter((o) => {
        return o.id.toString() === "10178" || o.id.toString() === "10181";
      });
      return result.map((o) => {
        return {
          name: o.attributes.name,
          id: o.id,
          background: "#0094D4",
          color: "#fff",
        };
      });
    },
    async activeCampaignItems(id) {
      let res = await Axios.get(
        `https://retailerapp.bbeta.ir/api/v1/Spree/GetTaxonByIdWithItsProducts?id=${id}`
      );
      // let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Visit/GetAllSpreeProducts`,{
      //     "SpreeTaxon":id,
      //     "CardCode":"c50000"
      // });
      let result = res.data.data.included;
      // result = result.filter((o)=>{
      //     return o.attributes.in_stock
      // })
      return result.map((o) => {
        return {
          name: o.attributes.name,
          discountPrice: 0,
          discountPercent: 0,
          price: o.attributes.price,
        };
      });
    },
    async getLastOrders() {
      let res = await Axios.post(
        `https://retailerapp.bbeta.ir/api/v1/Visit/GetAllUserPreOrder`,
        {
          CardCode: "c50000",
          Page: 1,
        }
      );
      let result = res.data.data.Items;
      result = result.filter((o, i) => o.Status === 2);
      result = result.slice(0, Math.min(result.length, 5));
      let items = [];
      for (let i = 0; i < result.length; i++) {
        items = items.concat(
          result[i].Items.map((item) => {
            return {
              name: item.ProductName,
              discountPrice: 0,
              discountPercent: 0,
              price: item.MinPrice,
            };
          })
        );
      }
      return items;
    },
    async getPreOrders() {
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
    async getAllProducts() {
      let res = localStorage.getItem("electricyLastFetch");
      if (res === null || res === undefined) {
        res = await Axios.post(
          `https://retailerapp.bbeta.ir/api/v1/Spree/AllProducts`,
          {
            CardCode: "c50000",
            Taxons: "10181,10178,10182",
            Include: "variants,option_types,product_properties,taxons,images",
            IsItemPriceNeeded: true,
          }
        );

        localStorage.setItem("electricyLastFetch", JSON.stringify(res));
      } else {
        res = JSON.parse(res);
      }
      let result = res.data.data.spreeResult.data;
      let included = res.data.data.spreeResult.included;
      let meta = res.data.data.spreeResult.meta;
      //   const item = res.data.data.data[0];
      const b1Result = res.data.data.b1Result; // all products
      // const product_properties_included_ids =
      //   item.relationships.product_properties.data.map((p) => p.id);
      // const option_types_included_ids =
      //   item.relationships.option_types.data.map((p) => p.id);
      // const variants_included_ids =
      //   item.relationships.variants.data.map((p) => p.id);
      const product_properties_included_values = included
        .filter((p) => p.type === "product_property")
        .map((p) => [p.attributes.name, p.attributes.value]);

      const option_types_included_values = included
        .filter((p) => p.type === "option_type")
        .map((p) => {
          const firstItem = meta.filters.option_types.find(
            (v) => v.id === p.id
          );
          let option_values =
            firstItem !== undefined
              ? firstItem.option_values.map((v) => {
                  return { name: v.presentation, id: v.id };
                })
              : null;
          return { id: p.id, name: p.attributes.name, items: option_values };
        });

      const variants_included_values = included
        .filter((p) => p.type === "variant")
        .map((p) => {
          let option_values = p.relationships.option_values.data;
          const variant_id = p.id; // int
          const b1_item = b1Result.find((i) => i.itemCode === p.attributes.sku);

          const variant_price =
            b1_item !== undefined
              ? b1_item.priceAfterCalculate
              : p.attributes.price; // int

          const variant_discount_price =
            b1_item !== undefined ? b1_item.priceAfterVat : p.attributes.price; // int

          const variant_discount_precent =
            b1_item !== undefined ? b1_item.discountPercent : 0; // int
          const variant_in_stock = b1_item !== undefined ? b1_item.totalQty : 0;
          const variant_option_values = p.relationships.option_values.data; // array -> {id, type}
          const option_types_with_option_values = option_types_included_values; // array -> { id: p.id, name: p.attributes.name, items: option_values }

          let option_values_result = {};

          for (const op_val of variant_option_values) {
            const selected_option_type = option_types_with_option_values.find(
              (x) =>
                x.items !== null && x.items.map((i) => i.id).includes(op_val.id)
            );

            if (
              selected_option_type === undefined ||
              selected_option_type === null
            )
              continue;

            option_values_result[selected_option_type.id.toString()] =
              selected_option_type.items.find((ov) => ov.id === op_val.id).id;
          }
          return {
            // optionValues: {
            //   color: "yellow",
            //   power: "10wat",
            // },
            id: variant_id,
            optionValues: option_values_result,
            discountPrice: variant_discount_price,
            discountPercent: variant_discount_precent,
            price: variant_price,
            inStock: variant_in_stock,
          };
        });

      console.log(variants_included_values);
      // return {
      //   name: item.attributes.name,
      //   code: `Code_${item.id}`,
      //   id: item.id,
      //   details: product_properties_included_values,
      //   optionTypes: option_types_included_values,
      //   variants: variants_included_values,
      //   campaignsPrices: [
      //     { name: "خرید عادی", price: false, id: "10178" },
      //     { name: "فروش ویژه 10 وات", price: 235600, id: "10181" },
      //   ],
      // };
    },
    // async getProducts() {
    //   let res = localStorage.getItem("electricyLastFetch");
    //   if (res === null || res === undefined) {
    //     const apiResult = await Axios.post(
    //       "https://retailerapp.bbeta.ir/api/v1/Spree/AllProducts",
    //       {
    //         CardCode: "c50000",
    //         Taxons: "10181,10178,10182",
    //         Include: "variants,option_types,product_properties,taxons,images",
    //         IsItemPriceNeeded: true,
    //       }
    //     );

    //     // let result = apiResult.data.data.spreeResult.data;
    //     let included = apiResult.data.data.spreeResult.included;
    //     let meta = apiResult.data.data.spreeResult.meta;
    //     // const item = apiResult.data.data.data[0];
    //     const b1Result = apiResult.data.data.b1Result.items; // all products

    //     let product_properties_included_values = [];
    //     let option_types_included_values = [];
    //     // let variants_included_values = [];
    //     let option_types_dictionary = {};
    //     for (let i = 0; i < meta.filters.option_types.length; i++) {
    //       let o = meta.filters.option_types[i];
    //       option_types_dictionary[o.id] = o;
    //     }
    //     for (let i = 0; i < included.length; i++) {
    //       let o = included[i];
    //       if (o.type === "product_property") {
    //         product_properties_included_values.push([
    //           o.attributes.name,
    //           o.attributes.value,
    //         ]);
    //       } else if (o.type === "option_type") {
    //         let option_type = option_types_dictionary[o.id];
    //         option_types_included_values.push({
    //           ...option_type,
    //           items: option_type.option_values.map((x) => {
    //             return { id: x.id, name: x.attributes.name };
    //           }),
    //         });
    //       } else if (o.type === "variant") {
    //       }
    //     }

    //     const variants_included_values = included
    //       .filter((p) => p.type === "variant")
    //       .map((p) => {
    //         let option_values = p.relationships.option_values.data;
    //         const variant_id = p.id; // int
    //         const b1_item = b1Result.find(
    //           (i) => i.itemCode === p.id.toString()
    //         );
    //         const variant_price = b1_item.length
    //           ? b1_item.price
    //           : p.attributes.price; // int
    //         const variant_in_stock = p.attributes.in_stock; // boolean
    //         const variant_option_values = p.relationships.option_values.data; // array -> {id, type}
    //         const option_types_with_option_values =
    //           product_properties_included_values; // array -> { id: p.id, name: p.attributes.name, items: option_values }

    //         let option_values_result = {};

    //         for (const op_val of variant_option_values) {
    //           const selected_option_type = option_types_with_option_values.find(
    //             (x) => x.items.map((i) => i.id).includes(op_val.id)
    //           );

    //           if (!selected_option_type.length) continue;

    //           option_values_result[selected_option_type.id.toString()] =
    //             selected_option_type.items.find((ov) => ov.id === op_val.id).id;
    //         }
    //         return {
    //           // optionValues: {
    //           //   color: "yellow",
    //           //   power: "10wat",
    //           // },
    //           optionValues: option_values_result,
    //           discountPrice: 0,
    //           discountPercent: 0,
    //           price: variant_price,
    //           inStock: variant_in_stock,
    //         };
    //       });

    //     console.log(
    //       "product_properties_included_values : ",
    //       product_properties_included_values
    //     );
    //     console.log(
    //       "option_types_included_values : ",
    //       option_types_included_values
    //     );
    //     console.log("variants_included_values : ", variants_included_values);

    //     // let time=new Date().getTime();
    //     // localStorage.setItem()
    //   }
    // },
  };
  if (loading) {
    $(".loading").css("display", "flex");
  }
  let result = await $$[type](parameter);
  $(".loading").css("display", "none");
  return result;
}
