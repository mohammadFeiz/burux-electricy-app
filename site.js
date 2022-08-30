
// var ruleData = {};
// const url = 'https://b1api.burux.com/api/BRXIntLayer/GetCalcData';
// var newprice = new Pricing(url, 41, 10 * 60 * 1000);
// var istarted = newprice.startservice().then((value) => { return value; });

// async function LoadRules() {
//     newprice.forceFetchData();
// }
// async function FetchData() {
//     newprice.forceLoadData();
// }


// async function CreatePriceList() {
//     const doc2 = {
//         "token": "{{token}}",
//         "marketdoc": {
//             "cardGroupCode": 167,
//             "cardCode": "c68592",
//             "marketingdetails": {
//                 "priceList": 2,
//                 "slpcode": 62
//             },
//             "marketingLines": [
//                 {
//                     "itemCode": "1370",
//                     "itemQty": 40
//                 },
//                 {
//                     "itemCode": "1372",
//                     "itemQty": 60
//                 },
//                 {
//                     "itemCode": "3060",
//                     "itemQty": 60
//                 },
//                 {
//                     "itemCode": "3062",
//                     "itemQty": 40
//                 },
//                 {
//                     "itemCode": "5320",
//                     "itemQty": 50
//                 },
//                 {
//                     "itemCode": "5322",
//                     "itemQty": 100
//                 },
//                 {
//                     "itemCode": "5330",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "5332",
//                     "itemQty": 35
//                 },
//                 {
//                     "itemCode": "5340",
//                     "itemQty": 30
//                 },
//                 {
//                     "itemCode": "5342",
//                     "itemQty": 70
//                 },
//                 {
//                     "itemCode": "5390",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "5392",
//                     "itemQty": 35
//                 },
//                 {
//                     "itemCode": "5812",
//                     "itemQty": 12
//                 },
//                 {
//                     "itemCode": "7552",
//                     "itemQty": 10
//                 },
//                 {
//                     "itemCode": "7550",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "9395",
//                     "itemQty": 36
//                 },
//                 {
//                     "itemCode": "7551",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "9414",
//                     "itemQty": 7
//                 }
//             ]
//         }
//     };
//     const ItemCodes = ["2370", "2372", "5320", "5322", "5340", "5342", "5330", "5332", "5390", "5392", "5810", "5812", "5850", "5852", "3580", "3582", "3581", "3060", "3062", "2830", "2832", "1370", "1372", "5500", "5502", "5501", "7550", "7552", "7551", "7700", "7702", "7560", "7562", "7570", "7571", "7572", "7720", "7722", "7730", "7732", "8920", "8922", "8930", "8932", "9415", "9408", "9396", "9395", "9402", "9400", "9398", "1270", "9414", "2820", "2822"];
//     const pricelist = newprice.autoPriceList(ItemCodes, doc2.marketdoc, null
//         , null, null, null, null, "01");
//     showpricelist(pricelist, "PriceListul");
// }

// async function CreateDocuments() {
//     const doctoissue = {
//         "token": "{{token}}",
//         "marketdoc": {
//             "docSource": 0,
//             "approvalStatus": 0,
//             "docType": 23,
//             "cardCode": "c50000",
//             "cardGroupCode": 169,
//             "marketingApprelatedId": "][o[p]p[]",
//             "docTime": "2022-08-13",
//             "marketingLines": [
//                 {
//                     "itemCode": "5322",
//                     "itemQty": 500.0,
//                     "toWhsCode": "01"
//                 },
//                 {
//                     "itemCode": "5332",
//                     "itemQty": 100.0,
//                     "toWhsCode": "01"
//                 },
//                 {
//                     "itemCode": "5352",
//                     "itemQty": 100.0,
//                     "toWhsCode": "01"
//                 }
//             ],
//             "deliverAddress": "تهران صفادشت بلواراصلی جنب خیابان تختی فروشگاه برق :, , ,",
//             "marketingdetails": {
//                 "invType": 1,
//                 "settleType": 1,
//                 "paymentTime": 5,
//                 "slpCode": 41,
//                 "deliveryType": 11,
//                 "payDueDate": 1,
//                 "campaign": 12
//             },
//             "paymentDetails": {
//                 "realPayerInfo": ""
//             },
//             "comment": "",
//             "documenttotal": 0.0,
//             "relatedteam": 1
//         }
//     };
//     const doc2 = {
//         "token": "{{token}}",
//         "marketdoc": {
//             "cardGroupCode": 167,
//             "cardCode": "c68592",
//             "marketingdetails": {
//                 "priceList": 2,
//                 "campaign": 12,
//                 "slpcode": 62
//             },
//             "marketingLines": [
//                 {
//                     "itemCode": "1370",
//                     "itemQty": 40
//                 },
//                 {
//                     "itemCode": "1372",
//                     "itemQty": 60
//                 },
//                 {
//                     "itemCode": "3060",
//                     "itemQty": 60
//                 },
//                 {
//                     "itemCode": "3062",
//                     "itemQty": 40
//                 },
//                 {
//                     "itemCode": "5320",
//                     "itemQty": 50
//                 },
//                 {
//                     "itemCode": "5322",
//                     "itemQty": 100
//                 },
//                 {
//                     "itemCode": "5330",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "5332",
//                     "itemQty": 35
//                 },
//                 {
//                     "itemCode": "5340",
//                     "itemQty": 30
//                 },
//                 {
//                     "itemCode": "5342",
//                     "itemQty": 70
//                 },
//                 {
//                     "itemCode": "5390",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "5392",
//                     "itemQty": 35
//                 },
//                 {
//                     "itemCode": "5812",
//                     "itemQty": 12
//                 },
//                 {
//                     "itemCode": "7552",
//                     "itemQty": 10
//                 },
//                 {
//                     "itemCode": "7550",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "9395",
//                     "itemQty": 36
//                 },
//                 {
//                     "itemCode": "7551",
//                     "itemQty": 15
//                 },
//                 {
//                     "itemCode": "9414",
//                     "itemQty": 7
//                 }
//             ]
//         }
//     };

//     showinvoice(doc2.marketdoc, "Requestul");
//     let newdoc = newprice.autoCalcDoc(doc2.marketdoc);
//     showinvoice(newdoc, "Responseul");
// }

// function showinvoice(MD, listname) {
//     document.getElementById(listname).innerHTML = MD.marketingLines.map(line => `<li>
//         itemCode: ${line?.itemCode}, Qty: ${line?.itemQty}, Price: ${line?.price}, FinalPrice: ${line?.priceAfterVat}, ExDis: ${line.campaignDetails?.exDiscount ?? 0}, CamDis: ${line.campaignDetails?.camDiscount ?? 0}, FinalDis: ${line.discountPercent ?? 0},Info: ${line.campaignDetails?.information ?? ""}
//       </li>`).join('');
// }
// function showpricelist(MD, listname) {
//     document.getElementById(listname).innerHTML = MD.map(line => `<li>
//         itemCode: ${line?.itemCode}, Price: ${line?.price}, FinalPrice: ${line?.finalPrice}, B1Dis: ${line?.b1Dscnt ?? 0}, CamDis: ${line?.cmpgnDscnt ?? 0}, FinalDis: ${line.pymntDscnt ?? 0},Info: ${line.campaignDetails?.information ?? ""}
//       </li>`).join('');
// }

// async function checkpricing() {

// }