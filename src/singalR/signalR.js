import {HubConnectionBuilder} from "@microsoft/signalr";

// "use strict";

// var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// document.getElementById("sendButton").disabled = true;

// connection.on("ReceiveMessage", function (user, message) {
//     var li = document.createElement("li");
//     document.getElementById("messagesList").appendChild(li);
//     li.textContent = `${user} says ${message}`;
// });

// connection.start().then(function () {
//     document.getElementById("sendButton").disabled = false;
// }).catch(function (err) {
//     return console.error(err.toString());
// });

// document.getElementById("sendButton").addEventListener("click", function (event) {
//     var user = document.getElementById("userInput").value;
//     var message = document.getElementById("messageInput").value;
//     connection.invoke("NewOrderInformClient", message).catch(function (err) {
//         return console.error(err.toString());
//     });
//     event.preventDefault();
// });

export default function SignalR(getState) {
    
    var connection = new HubConnectionBuilder().withUrl("https://retailerapp.bbeta.ir/hubclient").build();
    const orderStatuses=
    {
        Pending : 1,
        Taken : 2,
        DeliveredToCustomer : 3,
        CancelledByCustomer : 4,
        CancelledByElectricCustomer : 5,
        DeliveredToDeliverer : 6,
        Preparing : 7
    }

    let $$={
        start(){

            connection.on("BazargahOrder", async (order)=> {
                let {services,SetState,bazargah,showMessage,userCardCode} = getState();                
                let time = bazargah.forsate_akhze_sefareshe_bazargah;
                let type;
                if(order.status === 'Pending'){type = 'wait_to_get'}
                else if(order.status === 'Taken'){type = 'wait_to_send'}
                else {return}
                order = await services({type:'bazargahItem',parameter:{order,time,type}})
                if(order === false){return;}
                if(type === 'wait_to_get'){
                    bazargah.wait_to_get = bazargah.wait_to_get || [];
                    bazargah.wait_to_get.push(order);
                    showMessage('سفارش جدیدی در بازارگاه دارید')
                }
                else if(type === 'wait_to_send'){
                    bazargah.wait_to_get = bazargah.wait_to_get || [];
                    bazargah.wait_to_get = bazargah.wait_to_get.filter((o)=>o.orderId !== order.orderId)
                    if(userCardCode === order.cardCode){
                        bazargah.wait_to_send = bazargah.wait_to_send || [];
                        bazargah.wait_to_send.push(order) 
                    }
                }
                SetState({bazargah})
            });
            
            connection.start().then(function () {
                // document.getElementById("sendButton").disabled = false;
            }).catch(function (err) {
                return console.error(err.toString());
            });
        },
    };

    return {start:$$.start.bind($$)};
}