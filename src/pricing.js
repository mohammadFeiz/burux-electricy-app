// export default class Pricing {
//     "use strict";
//     //dbrequest = {};
//     updateInterval = 10 * 60 * 1000; // 10min
//     ndbrequest = {};
//     //updateTimer = setTimeout(this.refresh, this.updateInterval);
//     pricingData = {
//         ItemPrices: [], DisRules: [], CampRules: [], SlpCode: {}, Customer: {}
//     };
//     db = {};

//     constructor(fetchURL, applicator, interval = 10 * 60 * 1000) {

//         this.fetchUrl = fetchURL;

//         this.updateInterval = interval;
//         this.applicator = applicator;
//     }

//     openDataBase() {
//         return new Promise(function (resolve, reject) {

//         });
//     }

//     async CreateDatabase() {
//         self = this;
//         return new Promise(function (resolve, reject) {
//             self.ndbrequest = window.indexedDB.open("BRXINTLayerCalcData");
//             self.ndbrequest.onerror = function (event) {
//                 console.log("error: " + event.target.error);
//                 reject(event.target.error);
//             };

//             self.ndbrequest.onsuccess = function (event) {
//                 self.db = event.target.result;
//                 console.log("success: " + this.db);
//                 resolve(self.db);
//             };

//             self.ndbrequest.onupgradeneeded = function (event) {
//                 const newdb = event.target.result;
//                 if (newdb === undefined) {
//                     console.log("error");
//                     return false;
//                 }

//                 if (newdb.objectStoreNames.contains("itemPrices")) {
//                     newdb.deleteObjectStore("itemPrices");
//                 }
//                 let tbitemprice = newdb.createObjectStore("itemPrices", { keyPath: 'itemid', autoIncrement: true });
//                 let index = tbitemprice.createIndex("itemCode_idx", "itemCode");
//                 index = tbitemprice.createIndex("listNums_idx", "listNums");
//                 index = tbitemprice.createIndex("groupCode_idx", "groupCode");
//                 index = tbitemprice.createIndex("canSell_idx", "canSell");

//                 if (newdb.objectStoreNames.contains("discountRules")) {
//                     newdb.deleteObjectStore("discountRules");
//                 }
//                 let tbdisrules = newdb.createObjectStore("discountRules", { keyPath: 'disid', autoIncrement: true });
//                 index = tbdisrules.createIndex("cardCode_idx", "cardCode");
//                 index = tbdisrules.createIndex("cardgroupCode_idx", "cardgroupCode");
//                 index = tbdisrules.createIndex("itemCode_idx", "itemCode");
//                 index = tbdisrules.createIndex("itemGroupCode_idx", "itemGroupCode");
//                 index = tbdisrules.createIndex("validFrom_idx", "validFrom");
//                 index = tbdisrules.createIndex("validTo_idx", "validTo");
//                 index = tbdisrules.createIndex("priceList_idx", "priceList");
//                 index = tbdisrules.createIndex("type_idx", "type");
//                 if (newdb.objectStoreNames.contains("campaignRules")) {
//                     newdb.deleteObjectStore("campaignRules");
//                 }
//                 let tbcamprules = newdb.createObjectStore("campaignRules", { keyPath: 'camid', autoIncrement: true });
//                 index = tbcamprules.createIndex("camcardCode_idx", "camcardCode");
//                 index = tbcamprules.createIndex("camcardgroupCode_idx", "camcardgroupCode");
//                 index = tbcamprules.createIndex("itemCode_idx", "itemCode");
//                 index = tbcamprules.createIndex("itemGroupCode_idx", "itemGroupCode");
//                 index = tbcamprules.createIndex("camvalidFrom_idx", "camvalidFrom");
//                 index = tbcamprules.createIndex("camvalidTo_idx", "camvalidTo");
//                 index = tbcamprules.createIndex("camSettleType_idx", "camSettleType");
//                 index = tbcamprules.createIndex("camSalesChannel_idx", "camSalesChannel");
//                 index = tbcamprules.createIndex("campaignId_idx", "campaignId");

//                 if (newdb.objectStoreNames.contains("slpCode")) {
//                     newdb.deleteObjectStore("slpCode");
//                 }
//                 let tbapplicator = newdb.createObjectStore("slpCode", { keyPath: 'slpCodeid', autoIncrement: true });
//                 index = tbapplicator.createIndex("slpcode_idx", "slpCode");
//                 if (newdb.objectStoreNames.contains("customer")) {
//                     newdb.deleteObjectStore("customer");
//                 }
//                 let tbcustomer = newdb.createObjectStore("customer", { keyPath: 'customerid', autoIncrement: true });
//                 index = tbapplicator.createIndex("cardcde_idx", "cardCode");

//                 self.db = newdb;
//                 resolve(newdb);
//             };
//         });

//         ////prefixes of implementation that we want to test
//         //window.indexedDB = window.indexedDB || window.mozIndexedDB ||
//         //    window.webkitIndexedDB || window.msIndexedDB;

//         ////prefixes of window.IDB objects
//         //window.IDBTransaction = window.IDBTransaction ||
//         //    window.webkitIDBTransaction || window.msIDBTransaction;
//         //window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
//         //    window.msIDBKeyRange

//         //if (!window.indexedDB) {
//         //    window.alert("Your browser doesn't support a stable version of IndexedDB.")
//         //}
//     }

//     forceFetchData() {
//         return this.#fetchdata();
//     }

//     forceLoadData() {
//         return this.#getAllFromDataBase();
//     }

//     async #addDataToTable(tablename, rawdata, dbid) {
//         let isDone = true;
//         let nrequest;
//         let length = rawdata.length;
//         for (let i = 0; i < length; i++) {
//             nrequest = await dbid.transaction(tablename, 'readwrite')
//                 .objectStore(tablename)
//                 .put(rawdata[i]);
//             if (!isDone) {
//                 break;
//             }

//             nrequest.onsuccess = function (event) {
//             };

//             nrequest.onerror = function (event) {
//                 isDone = false;
//             }

//         }
//         return isDone;
//     }

//     async #fetchDataFromUrl(url) {
//         const data = await fetch(url, {
//             mode: 'cors',
//             headers: {
//                 'Access-Control-Allow-Origin': '*'
//             }
//         }).then((response) => {
//             return response.json();
//         }).then((data) => {
//             return data;
//         }).catch(function (error) {
//             console.log(error);
//             return null;
//         });
//         return data;
//     }

//     async #fetchdata() {
//         //const url = 'https://b1api.burux.com/api/BRXIntLayer/GetCalcData';
//         const data = await this.#fetchDataFromUrl(this.fetchUrl + '/' + this.applicator);
//         if (data) {
//             const countitem = data?.itemPrices?.length;
//             const countdisrules = data?.discountRules?.length;
//             const countcamprules = data?.campaignRules?.length;
//             const countslp = [data?.salePeople]?.length;
//             const countcustomer = [data?.customer]?.length;
//             console.log(countitem + ':' + countdisrules + ':' + countcamprules + ':' + countslp + ':' + countcustomer);
//             if (countitem) {
//                 this.pricingData.ItemPrices = data.itemPrices;
//                 if (await this.#clearAllDatafromTable("itemPrices", this.db).then((value) => { return value; }) === 1) {
//                     this.#addDataToTable("itemPrices", data.itemPrices, this.db);
//                 }
//                 else {
//                     return false;
//                 }
//             }
//             if (countdisrules) {
//                 this.pricingData.DisRules = data.discountRules;
//                 if (await this.#clearAllDatafromTable("discountRules", this.db).then((value) => { return value; }) === 1) {
//                     this.#addDataToTable("discountRules", data.discountRules, this.db);
//                 }
//                 else {
//                     return false;
//                 }
//             }
//             if (countcamprules) {
//                 this.pricingData.CampRules = data.campaignRules;
//                 if (await this.#clearAllDatafromTable("campaignRules", this.db).then((value) => { return value; }) === 1) {
//                     this.#addDataToTable("campaignRules", data.campaignRules, this.db);
//                 }
//                 else {
//                     return false;
//                 }
//             }
//             if (data?.customer) {
//                 this.pricingData.Customer = data.customer;
//                 if (await this.#clearAllDatafromTable("customer", this.db).then((value) => { return value; }) === 1) {
//                     this.#addDataToTable("customer", [data.customer], this.db);
//                 }
//                 else {
//                     return false;
//                 }
//             }
//             if (data?.salePeople) {
//                 this.pricingData.SlpCode = data.salePeople;
//                 if (await this.#clearAllDatafromTable("slpCode", this.db).then((value) => { return value; }) === 1) {
//                     this.#addDataToTable("slpCode", [data.salePeople], this.db);
//                 }
//                 else {
//                     return false;
//                 }
//             }
//             return true;
//         }
//         return false;
//     }

//     #clearAllDatafromTable(tablename, dbid) {
//         return new Promise(function (resolve, reject) {
//             if (dbid && dbid.objectStoreNames?.contains(tablename)) {

//                 let tx = dbid.transaction(tablename, 'readwrite');
//                 let txStore = tx.objectStore(tablename);
//                 let txdata = txStore.clear();
//                 txdata.onsuccess = function (event) {
//                     resolve(1);
//                 }
//                 txdata.onerror = function (event) {
//                     reject('error getting data: ' + (event.target).errorCode);
//                 }
//             }
//             else {
//                 resolve(1);
//             }
//         });
//     }

//     #getAllDatafromTable(tablename, dbid) {
//         return new Promise(function (resolve, reject) {
//             if (dbid.objectStoreNames.contains(tablename)) {

//                 let tx = dbid.transaction(tablename, 'readonly');
//                 let txStore = tx.objectStore(tablename);
//                 let txdata = txStore.getAll();
//                 txdata.onsuccess = function (event) {
//                     txdata = (event.target).result;
//                     resolve(txdata);
//                 }
//                 txdata.onerror = function (event) {
//                     reject('error getting data: ' + (event.target).errorCode);
//                 }
//             } else {
//                 reject('Cann\'t Find Store');
//             }
//         });
//     }

//     async #getAllFromDataBase() {
//         let isDone = true;
//         this.pricingData = { ItemPrices: [], DisRules: [], CampRules: [] };
//         this.pricingData.ItemPrices = await this.#getAllDatafromTable("itemPrices", this.db)
//             .then((value) => {
//                 return value;
//             }).catch(function (error) {
//                 console.log(error);
//                 isDone = false;
//                 return error;
//             });
//         this.pricingData.DisRules = await this.#getAllDatafromTable("discountRules", this.db)
//             .then((value) => {
//                 return value;
//             }).catch(function (error) {
//                 console.log(error);
//                 isDone = false;
//                 return error;
//             });
//         this.pricingData.CampRules = await this.#getAllDatafromTable("campaignRules", this.db)
//             .then((value) => {
//                 return value;
//             }).catch(function (error) {
//                 console.log(error);
//                 isDone = false;
//                 return error;
//             });
//         this.pricingData.SlpCode = await this.#getAllDatafromTable("slpCode", this.db)
//             .then((value) => {
//                 return value;
//             }).catch(function (error) {
//                 console.log(error);
//                 isDone = false;
//                 return error;
//             });
//         this.pricingData.Customer = await this.#getAllDatafromTable("customer", this.db)
//             .then((value) => {
//                 return value;
//             }).catch(function (error) {
//                 console.log(error);
//                 isDone = false;
//                 return error;
//             });
//         return isDone;
//     }

//     get discountRules() {
//         return this.pricingData.DisRules;
//     }

//     get campaignRules() {
//         return this.pricingData.CampRules;

//     }

//     get itemPrices() {
//         return this.pricingData.ItemPrices;
//     }

//     get pricingData() {
//         return this.pricingData;
//     }

//     startservice() {
//         let self = this;
//         let result=  new Promise(async function (resolve, reject) {
//             let newdb = await self.CreateDatabase()
//                 .then((value) => {
//                     console.log(value);
//                     return value;
//                 })
//                 .catch((value) => {
//                     console.log(value);
//                     return value;
//                 });
//             let resfetch =await self.#fetchdata();
//             if (!resfetch) {
//                 resfetch =await self.#getAllFromDataBase();
//             }
//             self.updateTimer = setTimeout(self.refresh, self.updateInterval, self);

//             resolve(resfetch);
//         });
//         return result;
//     }

//     async refresh(self) {
//         console.log((new Date()) + ": update started");
//         let isgotfromurl = await self.#fetchdata();
//         if (!isgotfromurl) {
//             let res = await self.#getAllFromDataBase();
//         }
//         console.log((new Date()) + ": update finished");
//         self.updateTimer = setTimeout(self.refresh, 10000, self);
//     }

//     stopUpdate() {
//         clearInterval(this.updateTimer);
//     }

//     startUpdate() {
//         this.updateTimer = setInterval(this.refresh, this.updateInterval);
//     }

//     isListNumExist(ListNums, ListNumtoCheck) {
//         if ((this.GetPriceFromListNum(ListNums, ListNumtoCheck)) > 0)
//             return true;
//         return false;
//     }

//     GetPriceFromListNum(listnums, listnumtocheck) {
//         let index = -1;
//         let price = -1;
//         if ((index = listnums.indexOf(":" + listnumtocheck + ":")) > 0) {
//             let secondindex = listnums.indexOf('{', index + 4);
//             if (secondindex < 0) return null;
//             let thirdindex = listnums.indexOf('}', secondindex + 1);
//             if (thirdindex > secondindex) {
//                 price = Number(listnums.substring(secondindex + 1, thirdindex));
//                 if (price > 0) {
//                     return price;
//                 }
//             }
//         }
//         return -1;
//     }

//     CalcColumns(expression, BasePrice, BaseDis, FixDis, QtyDis, VolDis
//         , RowDis, FixAmnt, MaxDis) {
//         let res = 0;
//         switch (expression) {
//             case "min(MaxDis,FixDis+QtyDis+VolDis+RowDis)":
//                 res = Math.min(MaxDis, FixDis + QtyDis + VolDis + RowDis);
//                 break;
//             case "(BasePrice)*((100-BaseDis)*(100-RowDis)/10000)":
//                 res = (BasePrice) * ((100 - BaseDis) * (100 - RowDis) / 10000);
//                 break;
//             default:
//                 break;
//         }

//         return res;
//     }

//     GetJalali(Gdate) {
//         let gdate = new Date(Gdate);
//         let YYYY = gdate.getFullYear();
//         let MM = gdate.getMonth() + 1;
//         let DD = gdate.getDate();
//         let daysMonthGregorian = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//         let daysMonthJalali = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
//         let gy = YYYY - 1600;
//         let gm = MM - 1;
//         let g_day_no = 365 * gy + parseInt((gy + 3) / 4) - parseInt((gy + 99) / 100) + parseInt((gy + 399) / 400);
//         let i = 0;
//         for (i = 0; i < gm; ++i) {
//             g_day_no += daysMonthGregorian[i];
//         }
//         if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0))) {
//             // leap and after Feb
//             g_day_no++;
//         }
//         g_day_no += DD - 1;
//         let j_day_no = g_day_no - 79;
//         let j_np = parseInt(j_day_no / 12053); // 12053 = (365 * 33 + 32 / 4)
//         j_day_no %= 12053;
//         let jy = (979 + 33 * j_np + 4 * parseInt(j_day_no / 1461)); // 1461 = (365 * 4 + 4 / 4)
//         j_day_no %= 1461;
//         if (j_day_no >= 366) {
//             jy += parseInt((j_day_no - 1) / 365);
//             j_day_no = (j_day_no - 1) % 365;
//         }
//         for (i = 0; (i < 11 && j_day_no >= daysMonthJalali[i]); ++i) {
//             j_day_no -= daysMonthJalali[i];
//         }
//         i++;
//         j_day_no++;
//         let jd = j_day_no;
//         let jm = i;
//         let result = {
//             Name: jy + "/" + i + "/" + j_day_no,
//             Year: jy,
//             Month: jm,
//             Day: jd
//         }
//         return result;
//     }

//     FilllineMarketing(line) {
//         if (line.price != null && line.discountPercent != null && line.itemQty != null) {
//             line.gross = parseInt(line.itemQty * line.price / 1.09);
//             line.priceAfterDiscount = parseInt(line.price * (1 - line.discountPercent / 100) / 1.09);
//             line.priceAfterVat = parseInt(line.price * (1 - line.discountPercent / 100));
//             line.discount = parseInt(line.itemQty * line.price * line.discountPercent / 100 / 1.09);
//             line.vat = parseInt(line.itemQty * line.price * (1 - line.discountPercent / 100) / 1.09 * 0.09);
//             line.lineTotal = parseInt(line.itemQty * line.price * (1 - line.discountPercent / 100));
//         }
//         return line;
//     }

//     ZerolineMarketing(line) {
//         line.discount = line.discountPercent = line.itemQty = line.lineTotal = line.price = 0;
//         line.priceAfterDiscount = line.vat = line.secondQty = 0;
//         line.priceAfterDiscount = line.gross = line.priceAfterVat = 0;
//         line.discountSrc = 78;
//         line.priceSrc = 78;
//     }

//     CalculateCommission(qty, commission, docdate, paydate, settleType
//         , linetotal, slpcode, cardgroupcode, countsku) {
//         if (qty == 0 || commission == 0 || slpcode < 1) {
//             return null;
//         }
//         let result = {};
//         // محاسبه پورسانت پایه
//         result.value = qty * commission;
//         result.baseCommission = commission;
//         result.applyDate = new Date();
//         // محاسبه تاریخ
//         switch (paydate) {
//             case 1:
//                 result.applyDate.setDate(docdate + 5);
//                 break;
//             case 2:
//                 result.applyDate.setDate(docdate + 20);
//                 break;
//             case 3:
//                 result.applyDate.setDate(docdate + 30);
//                 break;
//             case 4:
//                 result.applyDate.setDate(docdate + 45);
//                 break;
//             case 6:
//                 result.applyDate.setDate(docdate + 60);
//                 break;
//             case 5:
//             default:
//                 result.applyDate.setDate(docdate + 90);
//                 break;
//         }
//         if (settleType == 1) {
//             result.applyDate = docdate;
//         }

//         // محاسبه عامل مشتری
//         switch (cardgroupcode) {
//             case 166:
//                 result.cGCoEff = 100;
//                 break;
//             case 167:
//                 result.value *= 0.9;
//                 result.cGCoEff = 90;
//                 break;
//             case 168:
//                 result.value *= 0.8;
//                 result.cGCoEff = 80;
//                 break;
//             case 169:
//                 result.value *= 0.7;
//                 result.cGCoEff = 70;
//                 break;
//             case 170:
//                 result.value *= 0.3;
//                 result.cGCoEff = 30;
//                 break;
//             default:
//                 result.value *= 0.9;
//                 result.cGCoEff = 30;
//                 break;
//         }

//         // محاسبه تعداد اقلام
//         let dateresult = this.GetJalali(docdate);
//         let jy = dateresult.Year;
//         let jm = dateresult.Month;
//         let jd = dateresult.Day;
//         let skusold = 0;
//         if (countsku) {
//             try {
//                 if (countsku.StartsWith("{")) countsku = countsku.Remove(0, 1);
//                 if (countsku.EndsWith("}")) countsku = countsku.Remove(countsku.Length - 1);
//                 let skus = countsku.Split("},{");
//                 //if (skus.length > 0 && skus.indexOf((x) => x.indexOf(jm.ToString("0#") + ":")>-1)>-1 &&
//                 //    !int.TryParse(skus.Find(x => x.Contains(jm.ToString("0#") + ":")).Remove(0, 3), out skusold))
//                 //    skusold = 0;
//                 skusold = 5;
//             }
//             catch (error) {
//                 skusold = 0;
//             }
//         }
//         result.skuSold = skusold;
//         result.percent = parseInt(result.value * 100 / linetotal);
//         result.extraCommission = skusold * 1.5 / 100 * result.value;
//         result.moreInfo = "{\"CardGroupCode\":" + cardgroupcode + ",\"CGCoEff\":" + result.cGCoEff
//             + ",\"SkuSold\":" + skusold + ",\"ExtraCommission\":" + result.extraCommission + "}";
//         return result;
//     }

//     CalculatePaymentDiscount(MD) {
//         if (MD.marketingdetails.settleType == null) {
//             MD.marketingdetails.settleType = 1;
//         }
//         if (MD.marketingdetails.paymentTime == null) {
//             MD.marketingdetails.paymentTime = 1;
//         }
//         MD.marketingdetails.documentdiscountpercent = 0;
//         if (MD.marketingdetails.paymentTime == 5
//             && MD.marketingdetails.settleType == 1) {
//             MD.marketingdetails.documentdiscountpercent = 5;
//         }
//         else if (MD.marketingdetails.settleType == 1) {
//             MD.marketingdetails.documentdiscountpercent = 4;
//         }
//         else if (MD.marketingdetails.settleType == 2) {
//             if (MD.marketingdetails.payduedate == null) {
//                 MD.marketingdetails.payduedate = 5;
//             }
//             switch (MD.marketingdetails.payduedate) {
//                 case 1:
//                     MD.marketingdetails.documentdiscountpercent = 4;
//                     break;
//                 case 2:
//                     MD.marketingdetails.documentdiscountpercent = 3;
//                     break;
//                 case 3:
//                     MD.marketingdetails.documentdiscountpercent = 2;
//                     break;
//                 case 4:
//                     MD.marketingdetails.documentdiscountpercent = 1;
//                     break;
//                 case 6:
//                 case 5:
//                 default:
//                     MD.marketingdetails.documentdiscountpercent = 0;
//                     break;
//             }
//         }
//         else {
//             MD.marketingdetails.DocumentDiscountPercent = 0;
//         }
//         return MD;
//     }

//     CalculatePriceDiscount(docdate, cardcode, cardgroupcode, lines,
//         listnum, Items, DisRules, marketingdetails = null, SlpCodes = null) {
//         if (lines == null) {
//             return null;
//         }
//         if (listnum == null) listnum = 2;
//         if (cardcode == null) {
//             cardgroupcode = 100;
//         }
//         if (docdate == null) {
//             docdate = new Date();
//         }
//         const itemcodes = [];
//         let itemgrpcode = -1;
//         for (let item of lines) {
//             if (item.itemCode && (item.itemQty > 0)) {
//                 itemcodes.push(item.itemCode);
//             }
//         }
//         const results = [];
//         let res;
//         let shortitem = [];
//         let shortrules = [];
//         let disctemp = [];

//         shortitem = Items.filter((x) => (x.canSell)
//             //      && ((GetMaxPriceFromListNum(x.ListNums) ?? -1.0) > 0)
//             && itemcodes.indexOf(x.itemCode) > -1);

//         for (let item of DisRules) {
//             if ((item.cardCode == cardcode || item.cardGroupCode == cardgroupcode || item.priceList == listnum)
//                 && ((!item.validFrom || docdate >= item.validFrom) && (!item.validTo || docdate <= item.validTo))) {
//                 for (let item1 of shortitem) {
//                     if (item1.itemCode == item.itemCode || item1.groupCode == item.itemGroupCode) {
//                         shortrules.push(item);
//                     }
//                 }

//             }
//         }
//         //shortrules = DisRules.filter((x) => (x.cardcode == cardcode || x.cardGroupCode == cardgroupcode || x.priceList == listnum)
//         //    && (shortitem.indexOf((y) => y.itemCode == x.itemCode || y.groupCode == x.itemGroupCode) > -1)
//         //    && (!x.validFrom || docdate >= x.validFrom) && (!x.validTo || docdate <= x.validTo));

//         for (let item of lines) {
//             res = null;
//             res = item;
//             res.price = 0;
//             if (res.itemCode == null) {
//                 results.push(res);
//                 continue;
//             }
//             if (res.itemQty == null) {
//                 results.push(res);
//                 continue;
//             }
//             let price = null;
//             if (shortitem.indexOf((x) => x.itemCode == res.itemCode && x.noDiscount == 'Y') > -1) {
//                 let foundprice = -1;
//                 let maxprice = -1;
//                 for (let itemrules of shortitem) {
//                     if (itemrules.itemCode == res.itemCode
//                         && (foundprice = this.GetPriceFromListNum(itemrules.listNums, listnum) > maxprice)) {
//                         maxprice = foundprice;
//                     }
//                 }
//                 if (maxprice <= 0) {
//                     results.push(res);
//                     continue;
//                 }
//                 res.price = maxprice;
//                 res.discountPercent = 0;
//                 res.discountSrc = 'P';
//                 res.priceSrc = 'P';
//                 results.push(this.FilllineMarketing(res));
//                 continue;
//             }
//             price = shortitem.filter((x) => x.itemCode == res.itemCode);
//             if (price != null) {
//                 res.secondQty = res.itemQty / Math.min(price[0]?.qtyinBox ?? 1, 1);
//                 res.unitOfMeasure = price[0]?.saleMeasureUnit;
//                 res.itemGroupCode = price[0]?.groupCode;
//             }

//             //Blanket Agreement
//             disctemp = [];
//             disctemp = shortrules.filter(x => x.type == 66 &&
//                 (cardcode == null ? false : x.cardCode == cardcode) && (res.itemCode == null ? false : x.itemCode == res.itemCode));
//             if (disctemp.length > 0) {
//                 let temp = 0;
//                 let temprule;
//                 for (rule of disctemp) {
//                     if ((rule.price * (1 - rule.DiscountPercent / 100)) > temp) {
//                         temp = rule.price * (1 - rule.DiscountPercent / 100);
//                         temprule = rule;
//                     }
//                 }
//                 if (temprule.price != null) {
//                     res.price = temprule.price;
//                     res.discountPercent = temprule.discountPercent;
//                     res.discountSrc = 66;
//                     res.priceSrc = 66;
//                     results.push(this.FilllineMarketing(res));
//                     continue;
//                 }
//             }

//             //Speical Price for BP
//             disctemp = [];
//             disctemp = shortrules.filter((x) => x.type == 83 && (cardcode == null ? false : x.cardCode == cardcode)
//                 && (res.itemCode == null ? false : x.itemCode == res.itemCode) && (x.minQty == null ? true : res.itemQty >= x.minQty)
//                 && (x.maxQty == null ? true : res.itemQty < x.maxQty));
//             if (disctemp.length > 0) {
//                 let temprule;
//                 let temp = 0;
//                 for (rule of disctemp) {
//                     if ((rule.price * (1 - rule.discountPercent / 100)) > temp) {
//                         temp = rule.price * (1 - rule.discountPercent / 100);
//                         temprule = rule;
//                     }
//                 }
//                 if (temprule.price != null) {
//                     res.price = temprule.price;
//                     res.discountPercent = temprule.discountPercent;
//                     res.discountSrc = 83;
//                     res.priceSrc = 83;
//                     results.push(this.FilllineMarketing(res));
//                     continue;
//                 }
//             }

//             //Finding Price

//             //Period And Volume
//             let havepv = false;
//             let pvdisount = 0;
//             disctemp = [];
//             disctemp = shortrules.filter((x) => x.type == 80 && x.priceList == listnum && (res.itemCode == null ? false : x.itemCode == res.itemCode) &&
//                 (x.minQty == null ? true : res.itemQty >= x.minQty) && (x.maxQty == null ? true : res.itemQty < x.maxQty));
//             res.price = null;
//             if (disctemp.length > 0) {
//                 let temprule;
//                 let temp = 0;
//                 for (let rule of disctemp) {
//                     if ((rule.price) > temp) {
//                         temp = rule.price;
//                         temprule = rule;
//                     }
//                 }
//                 if (temprule.price != null) {
//                     //Price from Period and Volume Founded
//                     res.price = temprule.price;
//                     pvdisount = temprule.discountPercent;
//                     havepv = true;
//                 }
//             }

//             //Finidding Price
//             //Price List
//             if (!havepv) {
//                 let shortitem1 = shortitem.filter((x) => (x.itemCode == res.itemCode) && this.isListNumExist(x.listNums, listnum));
//                 if (shortitem1.length > 0) {
//                     // Price List Founded
//                     let foundedMax = -1;
//                     let founded = -1;
//                     for (let itemrule of shortitem1) {
//                         if ((founded = this.GetPriceFromListNum(itemrule.listNums, listnum)) > foundedMax) {
//                             foundedMax = founded;
//                         }
//                     }
//                     res.price = foundedMax;
//                 }
//                 if (res.price == null) {
//                     //No Price is Founded
//                     res.discountPercent = null;
//                     res.discountSrc = 78;
//                     res.priceSrc = 78;
//                     results.push(this.FilllineMarketing(res));
//                     continue;
//                 }
//             }

//             //Finding Discount
//             //Disount Group Code
//             res.discountPercent = 0;
//             disctemp = [];
//             disctemp = shortrules.filter((x) => x.type == 68 &&
//                 ((res.itemCode == null ? false : x.itemCode == res.itemCode) || (res.itemGroupCode == null ? false : x.itemGroupCode == res.itemGroupCode)) &&
//                 ((!x.minQty) || res.itemQty >= x.minQty) && ((!x.maxQty) || res.itemQty < x.maxQty));
//             if (disctemp.length > 0) {
//                 let temprule;
//                 let temp = 101;
//                 // فقط مدل حداقل تخفیف پیاده سازی شده است. مدل ضرایب تخفیف و حداکثر هم باید پیاده سازی شود
//                 for (let rule of disctemp) {
//                     if ((rule.discountPercent) < temp) {
//                         temp = rule.discountPercent;
//                         temprule = rule;
//                     }
//                 }
//                 if (temprule.discountPercent != null) {
//                     res.discountPercent = temprule.discountPercent;
//                     res.discountSrc = 68;
//                     res.priceSrc = 65;
//                     results.push(this.FilllineMarketing(res));
//                     continue;
//                 }
//             }

//             if (havepv) {
//                 // Discount and Price founded in PV
//                 res.discountPercent = pvdisount;
//                 //res.DiscountSource = enDiscountRuleType.PeriodandVolume;
//                 res.discountSrc = 80;
//                 res.priceSrc = 80;
//                 results.push(this.FilllineMarketing(res));
//                 continue;
//             }

//             // No Discount Founded
//             res.discountPercent = 0;
//             res.discountSrc = 90;
//             res.priceSrc = 65;
//             results.push(this.FilllineMarketing(res));

//         }

//         // تنظیمات برای محاسبه پورسانت
//         let commission = 0;
//         let needcommission = true;
//         let havesku = false;
//         let countsku = "";
//         if (!marketingdetails || marketingdetails.slpCode == -1) {
//             needcommission = false;
//         }
//         else {
//             if (SlpCodes && SlpCodes.length > 1
//                 && SlpCodes.indexOf(x => x.slpCode == marketingdetails.slpCode && (countsku = x.countSku) != null) > -1) {
//                 havesku = true;
//             }
//         }
//         if (needcommission) {
//             for (let item of results) {
//                 if (item.itemCode == null || item.itemQty == null) {
//                     continue;
//                 }

//                 // اضافه کردن پورسانت
//                 commission = 0;
//                 for (let itemcom of shortitem) {
//                     if (itemcom.itemCode == item.itemCode) {
//                         commission = itemcom.commission;
//                         let com = this.CalculateCommission(item.itemQty, commission, docdate, marketingdetails.payDueDate, marketingdetails.settleType
//                             , item.lineTotal, marketingdetails.slpCode, cardgroupcode, havesku ? countsku : "");
//                         if (com != null) {
//                             item.lineCommission = [com];
//                         }
//                     }
//                 }
//             }
//         }
//         return results;
//     }

//     CalculateDocumentByB1(MD, Items, DisRules, SlpCodes = null) {
//         if (!MD.marketingLines) {
//             return MD;
//         }
//         if (!MD.marketingdetails) {
//             MD.marketingdetails = {};
//         }
//         if (!MD.marketingdetails.priceList) MD.marketingdetails.priceList = 2;
//         if (!MD.cardCode) {
//             MD.cardGroupCode = 100;
//         }
//         if (!MD.docTime) {
//             MD.docTime = new Date();
//         }
//         let results = {};
//         results.marketingLines = [];
//         let res = [];
//         let shortitem = [];
//         let shortrules = [];
//         let disctemp = [];
//         //shortrules = DisRules.filter((x) => {
//         //    return (x.CardCode == MD.CardCode || x.CardGroupCode == MD.CardGroupCode || x.PriceList == MD.marketingdetails.PriceList)
//         //        && (x.ValidFrom == null ? true : MD.DocTime >= x.ValidFrom) && (x.ValidTo == null ? true : MD.DocTime <= x.ValidTo)
//         //});
//         shortrules = DisRules.filter(checkshortrules);
//         function checkshortrules(disrules) {
//             return (disrules.cardCode == MD.cardCode || disrules.cardGroupCode == MD.cardGroupCode || disrules.priceList == MD.marketingdetails.priceList)
//                 && (!disrules.validFrom || MD.docTime >= disrules.validFrom) && (!disrules.validTo || MD.docTime <= disrules.validTo);
//         }
//         results.marketingLines = this.CalculatePriceDiscount(MD.docTime, MD.cardCode, MD.cardGroupCode, MD.marketingLines
//             , MD.marketingdetails.priceList, Items, shortrules, MD.marketingdetails, SlpCodes);

//         // محاسبه جمع فاکتور
//         let sum = 0;
//         let commission = 0;
//         let extracommission = 0;
//         let applydate = null;
//         for (let item of results.marketingLines) {
//             sum += item.lineTotal;
//             if (item.lineCommission) {
//                 for (let x of item.lineCommission) {
//                     if (x.value != 0) {
//                         commission += x.value;
//                         extracommission += x.extraCommission;
//                         applydate = x.applyDate > applydate ? x.applyDate : applydate;
//                     }
//                 };
//             }
//         }
//         MD.marketingLines = results.marketingLines;
//         results = MD;
//         if (commission > 0) {
//             results.marketingdetails.totalcommission = {
//                 applydate: applydate,
//                 value: commission,
//                 extraCommission: extracommission,
//                 percent: sum != 0 ? parseInt(100 * commission / sum) : 0
//             };
//         }

//         MD = this.CalculatePaymentDiscount(MD);

//         results.marketingdetails.documentdiscount = results.marketingdetails.documentdiscountpercent * sum / 100;
//         results.documenttotal = sum - results.marketingdetails.documentdiscount;

//         return results;
//     }

//     CalculateDocumentByAll(MD, Items, DisRules, campaignRules, SlpCodes = null) {
//         let DocAfterB1 = this.CalculateDocumentByB1(MD, Items, DisRules, SlpCodes);
//         let DocAfterCa = this.CalculatePriceDiscountByCampaign(DocAfterB1, campaignRules, false);
//         return DocAfterCa;
//     }

//     CalculatePriceDiscountByCampaign(MD, campaignRules, KeepOthers = false) {
//         if (!MD || MD.marketingLines == null || MD.marketingdetails == null || MD.marketingdetails.campaign == null) {
//             return MD;
//         }

//         if (MD.marketingdetails.priceList == null) MD.marketingdetails.priceList = 2;
//         if (MD.cardCode == null) {
//             MD.cardGroupCode = 100;
//         }
//         if (MD.docTime == null) {
//             MD.docTime = new Date();
//         }
//         let results = {};
//         results = MD;
//         let itemofraws = results.marketingLines.filter((x) => x.campaignDetails != null);
//         for (let item of itemofraws) {
//             if (item.campaignDetails != null) { item.campaignDetails.status = -2; }
//         };
//         let shortrules = [];

//         // ساخت لیست قواعد مربوط به مشتری یا گروه مشتری
//         for (let itemrules of campaignRules) {
//             if ((itemrules.campaignId == (MD.marketingdetails.campaign))
//                 && (itemrules.camType == "B")
//                 && (!itemrules.camCardCode || (itemrules.camCardCode.indexOf("," + MD.cardCode + ",")) > -1)
//                 && (!itemrules.camCardGroupCode || (itemrules.camCardGroupCode.indexOf("," + MD.cardGroupCode + ",")) > -1)
//                 && (!itemrules.camValidFrom || MD.docTime >= itemrules.camValidFrom)
//                 && (!itemrules.camValidTo || MD.docTime <= itemrules.camValidTo)
//                 && (!itemrules.camSettleType || (itemrules.camSettleType == MD.marketingdetails.settleType || itemrules.camSettleType == 2))
//                 && (!itemrules.camSalesChannel || (itemrules.camSalesChannel == MD.marketingdetails.saleChannel || itemrules.camSalesChannel == 1))
//             ) {
//                 shortrules.push(itemrules);
//             }
//         }
//         //shortrules = campaignRules.filter((x) =>
//         //    (x.campaignId == (MD.marketingdetails.campaign))
//         //    && (x.camType == "B")
//         //    && (!x.camCardCode || (x.camCardCode.indexOf("," + MD.cardCode + ",")) > -1)
//         //    && (!x.camCardGroupCode || (x.camCardGroupCode.indexOf("," + MD.cardGroupCode + ",")) > -1)
//         //    && (!x.camValidFrom || MD.docTime >= x.camValidFrom)
//         //    && (!x.camValidTo || MD.docTime <= x.camValidTo)
//         //    && (!x.camSettleType || (x.camSettleType == MD.marketingdetails.settleType || x.camSettleType == 2))
//         //    && (!x.camSalesChannel || (x.camSalesChannel == MD.marketingdetails.saleChannel || x.camSalesChannel == 1))
//         //);
//         let bri = [];
//         let PrssdLine = [];
//         let br = {};
//         // فعلا فقط پیاده سازی تعدادی انجام شده است. پیاده سازی مبلغی باید بعدا اضافه شود.

//         if (shortrules.length > 0) {
//             let isReq = false;
//             let linenum = 0;
//             let maxline = 0;
//             for (let item of shortrules) {
//                 if (item.lineisRequired) isReq = true;
//                 br.isReq = item.lineisRequired;
//                 br.eqCoEff = item.lineReqCoEff ?? 0;
//                 br = {};
//                 br.lines = [];
//                 br.rowNo = item.lineRowNum;
//                 br.qty = 0;
//                 br.value = 0;
//                 br.disQty = 0;
//                 br.fixedValue = item.lineFixedValue ?? 0;
//                 br.formula = item.lineDisRelationFormula;
//                 br.commissionEffect = item.commissionEffect;

//                 linenum = 0;
//                 for (let line of results.marketingLines) {
//                     if (!line.campaignDetails) line.campaignDetails = {
//                         status: -2,
//                         information: ""
//                     };
//                     let temp = "," + item.lineItemCode + ",";
//                     if (temp.indexOf("," + line.itemCode + ",") > -1 && !PrssdLine.indexOf(linenum) > -1) {
//                         br.isExist = true;
//                         PrssdLine.push(linenum);
//                         br.lines.push(linenum);
//                         // پردازش قواعد کمپین
//                         // قاعده حداکثر تعداد
//                         if (item.lineMaxReqQty != null) {
//                             if (br.qty == item.lineMaxReqQty || br.isFull) {
//                                 line.secondQty = 0;
//                                 line.campaignDetails.status = 0;
//                                 line.campaignDetails.information += "مقدار تقاضا شده این خط بیشتر از مقدار مجاز (" + item.lineMaxReqQty + ") است. این خط حذف میشود.";
//                                 line.campaignDetails.requestedQty = line.itemQty;
//                                 line.itemQty = 0;
//                                 br.isFull = true;
//                                 br.status = 0;
//                                 if (!KeepOthers ?? false) this.ZerolineMarketing(line);
//                             }
//                             else if ((br.qty + line.itemQty > item.lineMaxReqQty) && !br.isFull) {
//                                 line.campaignDetails.status = 2;
//                                 line.campaignDetails.information += "مقدار تقاضا شده این خط بیشتر از مقدار مجاز(" + item.lineMaxReqQty + ") است. حداکثر مقدار مجاز در نظر گرفته می شود.";
//                                 line.campaignDetails.requestedQty = line.itemQty;
//                                 line.secondQty = line.secondQty * (item.lineMaxReqQty - br.qty) / line.itemQty;
//                                 line.itemQty = item.lineMaxReqQty - br.qty;
//                                 br.isFull = true;
//                                 br.qty = item.lineMaxReqQty;
//                             }
//                             else {
//                                 line.campaignDetails.status = 1;
//                                 br.qty += line.itemQty;
//                             }

//                         }
//                         // قواعد حداکثر مبلغ
//                     }
//                     linenum++;
//                 }

//                 // قاعده حداقل تعداد
//                 if (item.lineMinReqQty && item.lineMinReqQty != 0)
//                     if (br.qty < item.lineMinReqQty) {
//                         for (let itemb1 of br.lines) {
//                             if (!results.marketingLines[itemb1].campaignDetails) {
//                                 results.marketingLines[itemb1].campaignDetails = {};
//                             }
//                             results.marketingLines[itemb1].campaignDetails.status = 0;
//                             results.marketingLines[itemb1].campaignDetails.information += "مقدار تقاضا شده این خط کمتر از مقدار مجاز ( " + item.lineMinReqQty0 + " )است. این خط حذف می شود.";
//                             results.marketingLines[itemb1].campaignDetails.requestedQty = results.marketingLines[itemb1].itemQty;
//                             results.marketingLines[itemb1].itemQty = 0;
//                             if (!KeepOthers ?? false) this.ZerolineMarketing(results.marketingLines[itemb1]);
//                         }
//                         br.disQty = 0;
//                         br.isExist = false;
//                     }

//                 // قاعده حداقل مبلغ
//                 // محاسبه تخفیف تعدادی
//                 if (item.lineDisPerQtyStp && item.lineDisPerQtyStp != 0) {
//                     br.disQty = Math.max(item.lineMaxDisPerQty, item.lineMaxDisPrcnt,
//                         (Math.ceil(br.qty / item.lineStepReqQtyl)) * item.lineDisPerQtyStp);
//                 }
//                 else {
//                     br.disQty = item.lineMaxDisPrcnt;
//                 }


//                 // محاسبه تخفیف مبلغی
//                 br.disVol = 0;

//                 // محاصبه تخفیف اقلام
//                 linenum = 0;
//                 let maxline = MD.marketingLines.length;
//                 for (linenum = 0; linenum < maxline; linenum++) {
//                     let lineMD = MD.marketingLines[linenum];
//                     if (br.lines.indexOf(linenum) > -1)
//                         if (lineMD.campaignDetails.status == 1 || lineMD.campaignDetails.Status == 2) {
//                             if (!lineMD.price) {
//                                 lineMD.campaignDetails.information += "اطلاعات قیمت کالا موجود نمی باشد.";
//                                 lineMD.campaignDetails.status = -1;
//                                 continue;
//                             }
//                             // اصلاح شود
//                             let newPrice = this.CalcColumns(item.lineDisRelationFormula, lineMD.price, item.camCanHaveB1Dis ? lineMD.discountPercent : 0
//                                 , item.lineBaseDis, br.disQty, br.disVol, 0, item.lineFixedValue, 0);
//                             lineMD.discountPercent = Math.round(Math.max(0.0, 100.0 - newPrice / lineMD.price * 100), 2);
//                             if (item.lineFixedValue != null) lineMD.campaignDetails.information += "مبلغ " + item.lineFixedValue + " ریال از مبلغ قلم کالا کسر شد.";
//                             results.marketingLines[linenum] = this.FilllineMarketing(lineMD);
//                         }
//                         else {
//                             if (!KeepOthers) this.ZerolineMarketing(lineMD);
//                         }
//                 }
//                 bri.push(br);
//             }
//             // پردازش قواعد تخفیف کل فاکتور
//             // قاعده وجود کالاهای لازم
//             if (isReq) {
//                 let sumreq = 0;
//                 let sumnoreq = 0;
//                 for (let briitem of bri) {
//                     if (briitem.isReq) {
//                         sumreq += briitem.reqCoEff * briitem.qty;
//                     } else {
//                         sumnoreq += briitem.reqCoEff * briitem.qty;
//                     }
//                 }
//                 if (sumreq < sumnoreq) {
//                     results.marketingLines = MD.marketingLines;
//                     for (let line of results.marketingLines) {
//                         if (line.campaignDetails == null) { line.campaignDetails = {}; }
//                         line.campaignDetails.status = -1;
//                         line.CampaignDetails.information = "شرط اقلام کمپین برآورده نشده است.";
//                     };
//                     results.marketingdetails.documentDiscountPercent = 0;
//                     results.marketingdetails.documentDiscount = 0;
//                     return results;
//                 }
//             }

//             // قاعده تعداد خطوط فاکتور
//             let rownum = bri.filter(x => x.isExist).length;
//             if (rownum > shortrules[0].camMaxRow || rownum < shortrules[0].camMinRow) {
//                 results.marketingLines = MD.marketingLines;
//                 for (let line of results.marketingLines) {
//                     if (!line.campaignDetails) {
//                         line.campaignDetails = {};
//                     }
//                     line.campaignDetails.status = -1;
//                     line.campaignDetails.information = "شرط تعداد خطوط فاکتور کمپین برآورده نشده است.";
//                 };
//                 results.marketingdetails.documentDiscountPercent = 0;
//                 results.marketingdetails.documentDiscount = 0;
//                 return results;
//             }
//             let RowDis = rownum * shortrules[0].camRowDisPrcnt;
//             if (shortrules[0].camMaxRowDisPrcnt) {
//                 RowDis = Math.min(shortrules[0].camMaxRowDisPrcnt, rownum * shortrules[0].camRowDisPrcnt);
//             }

//             // قاعده مبلغ فاکتور
//             let VolDis = 0;

//             // محاسبه تخفیف اقلام
//             // تخفیفات برای همه اقلام براساس یک فرمول محاسبه می گردد.
//             let Rule = shortrules[0].camDisRelationFormula;
//             let Fixdis = shortrules[0].camBaseDiscount ? shortrules[0].camBaseDiscount : 0;
//             let MaxDis = shortrules[0].camMaxDisPrcnt ? shortrules[0].camMaxDisPrcnt : 100;
//             let DocDis = this.CalcColumns(Rule, 0, 0, Fixdis, 0, VolDis, RowDis, 0, MaxDis);

//             // محاسبه تغییرات پورسانت
//             let CommissionEffect = 101;

//             for (let x of bri) {
//                 if (x.commissionEffect > 0 && x.commissionEffect <= CommissionEffect) {
//                     CommissionEffect = x.commissionEffect;
//                 }
//             }
//             if (CommissionEffect == 101) {
//                 CommissionEffect = 0;
//             }
//             //محاسبه جمع فاکتور و اعمال تخفیف اقلامی
//             let sum = 0;
//             linenum = 0;
//             maxline = MD.marketingLines.length;
//             for (linenum = 0; linenum < maxline; linenum++) {
//                 let lineMD = MD.marketingLines[linenum];
//                 if (lineMD.campaignDetails == null) {
//                     lineMD.campaignDetails = { status: -2 };
//                 }
//                 if (lineMD.campaignDetails.status == 1
//                     || lineMD.campaignDetails.status == 2) {
//                     // اعمال تخفیف تعداد اقلام بر روی هر خط فاکتور
//                     lineMD.campaignDetails.camDiscount = DocDis;
//                     lineMD.campaignDetails.exDiscount = lineMD.discountPercent;
//                     lineMD.discountPercent = 100 - (100 - lineMD.discountPercent) * (100 - DocDis) / 100;
//                     lineMD = this.FilllineMarketing(lineMD);
//                     sum += lineMD.lineTotal ?? 0;
//                 }
//                 else if (lineMD.campaignDetails.status == -2) {
//                     lineMD.campaignDetails.requestedQty = lineMD.itemQty;
//                     if (!KeepOthers) this.ZerolineMarketing(lineMD);
//                     lineMD.campaignDetails.information += "این قلم کالا مشمول کمپین نمی باشد.";
//                 }

//                 // محاسبه تغییرات پورسانت
//                 if (lineMD.lineCommission && lineMD.lineCommission.length > 0 && CommissionEffect > 0) {
//                     lineMD.lineCommission[0].value *= CommissionEffect / 100;
//                     lineMD.lineCommission[0].extraCommission *= CommissionEffect / 100;
//                     lineMD.lineCommission[0].percent *= CommissionEffect / 100;
//                 }
//             }

//             MD = this.CalculatePaymentDiscount(MD);

//             if (!results.marketingdetails.totalcommission
//                 && results.marketingdetails.totalcommission > 0 && CommissionEffect > 0) {
//                 results.marketingdetails.totalcommission.value *= CommissionEffect / 100;
//                 results.marketingdetails.totalcommission.extraCommission *= CommissionEffect / 100;
//                 results.marketingdetails.totalcommission.percent *= CommissionEffect / 100;
//             }

//             results.marketingdetails.documentdiscount = results.marketingdetails.documentdiscountpercent * sum / 100;
//             results.documentTotal = sum - results.marketingdetails.documentdiscount;
//             return results;
//         }
//         for (let line of results.marketingLines) {
//             line.campaignDetails = {
//                 status: -2,
//                 information: "مشمول کمپین نمی شود."
//             };
//         };
//         return results;
//     }

//     GetPriceListInfo(ItemCodes, Items, DisRules, campaignRules, SlpCodes = null, CurrentDoc = null, CardCode = null
//         , CardGroupCode = 100, payDueDate = 1, paymentTime = 1, settleType = 1, WhsCode = "01") {
//         let result = [];
//         let doctocalc = {};
//         let error = null;
//         //بررسی سند ورودی
//         if (CurrentDoc) {
//             doctocalc = CurrentDoc;
//         }

//         if (!doctocalc.marketingdetails)
//             doctocalc.marketingdetails = {};
//         if (!doctocalc.marketingLines)
//             doctocalc.marketingLines = {};
//         if (!doctocalc.marketingdetails.payDueDate)
//             doctocalc.marketingdetails.payDueDate = payDueDate;
//         if (!doctocalc.marketingdetails.paymentTime)
//             doctocalc.marketingdetails.paymentTime = paymentTime;
//         if (!doctocalc.marketingdetails.settleType)
//             doctocalc.marketingdetails.settleType = settleType;
//         if (!doctocalc.whsCode)
//             doctocalc.whsCode = WhsCode;
//         if (!doctocalc.cardCode)
//             doctocalc.cardCode = CardCode;
//         if (!doctocalc.cardGroupCode)
//             doctocalc.cardGroupCode = CardGroupCode;
//         if (!doctocalc.cardGroupCode && !doctocalc.cardCode) {
//             error += "مقدار مشتری یا گروه مشتری ضروری است";
//             return null;
//         }

//         //بررسی اینکه آیا نیاز به اعمال تخفیفات بی وان می باشد؟
//         let isneedb1 = true;
//         if (doctocalc.marketingdetails.campaign) {
//             let camrul = {};
//             if (campaignRules.indexOf(x => (camrul = x) && x.campaignId == doctocalc.marketingdetails.campaign) > -1) {
//                 isneedb1 = camrul.camCanHaveB1Dis;
//             }
//         }

//         //محاسبه تخفیف نحوه پرداخت
//         doctocalc = this.CalculatePaymentDiscount(doctocalc);
//         let PaymentDic = doctocalc.marketingdetails?.documentDiscountPercent ?? 0;

//         //ساختن اقلام سند برای محاسبه
//         let onhand = null;

//         for (let item of ItemCodes) {
//             onhand = null;
//             for (let item1 of Items) {
//                 if (item1.itemCode == item && item1.inventory && item1.inventory.length >= 1) {
//                     for (let iteminv of item1.inventory) {
//                         if (iteminv.whsCode == doctocalc.whsCode && iteminv.qtyLevRel) {
//                             onhand = iteminv;
//                         }
//                     }
//                 }
//             }
//             result.push({
//                 itemCode: item,
//                 onHand: onhand,
//             });
//             if (!doctocalc.marketingLines.indexOf(x => x.itemCode == item) > -1) {
//                 doctocalc.marketingLines.push({
//                     itemCode: item,
//                     itemQty: 1,
//                 });
//             }
//         }

//         let DocAfterB1 = doctocalc;
//         // محاسبه قیمت و تخفیف در بی وان
//         if (isneedb1) {
//             DocAfterB1 = this.CalculateDocumentByB1(doctocalc, Items, DisRules, SlpCodes);

//             if (DocAfterB1 == null || DocAfterB1.marketingLines == null) {
//                 error += "خطا در محاسبه تخفیفات در بی وان";
//                 return null;
//             }

//             let lp = {};
//             for (let item of DocAfterB1.marketingLines) {
//                 lp = {};
//                 for (let itemresult of result) {
//                     if (itemresult.itemCode == item.itemCode) {
//                         lp = itemresult;
//                         lp.price = item.price ?? 0;
//                         lp.b1Dscnt = item.discountPercent ?? 0;
//                         lp.finalPrice = parseInt(item.priceAfterVat ?? 0);
//                         lp.pymntDscnt = PaymentDic;
//                         lp.cmpgnDscnt = 0;
//                     }
//                 }
//             }
//         }

//         //بررسی متد کمپین
//         if (doctocalc.marketingdetails?.campaign) {
//             let DocAfterCa = this.CalculatePriceDiscountByCampaign(DocAfterB1, campaignRules, true);
//             let lp = {};
//             for (let item in DocAfterCa.marketingLines) {
//                 lp = {};
//                 for (let itemresult of result) {
//                     if (itemresult.itemCode == item.itemCode) {
//                         lp = itemresult;
//                         lp.price = item.price ?? 0;
//                         lp.finalPrice = parseInt(item.priceAfterVat ?? 0);
//                         lp.pymntDscnt = PaymentDic;
//                         lp.cmpgnDscnt = 100 - (100 - item.discountPercent ?? 0) / (100 - lp.b1Dscnt) * 100;
//                     }
//                 }
//             }
//         }

//         for (let item of result) {
//             item.finalPrice = parseInt((item.finalPrice ?? 0) * (1 - (item.pymntDscnt ?? 0) / 100));
//         }

//         return result;
//     }

//     autoCalcDoc(MD) {
//         return this.CalculateDocumentByAll(MD, this.pricingData.ItemPrices, this.pricingData.DisRules, this.pricingData.CampRules, [this.pricingData.SlpCode]);
//     }

//     autoPriceList(ItemCodes, CurrentDoc = null, CardCode = null
//         , CardGroupCode = 100, payDueDate = 1, paymentTime = 1, settleType = 1, WhsCode = "01") {
//         return this.GetPriceListInfo(ItemCodes, this.pricingData.ItemPrices, this.pricingData.DisRules, this.pricingData.CampRules
//             , [this.pricingData.SlpCode], CurrentDoc, CardCode, CardGroupCode, payDueDate, paymentTime, settleType, WhsCode);
//     }
// }







