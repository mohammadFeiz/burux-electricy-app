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
    const orderStatuses={
        Pending,
        Taken,
        DeliveredToCustomer,
        CancelledByCustomer,
        CancelledByElectricCustomer,
        DeliveredToDeliverer,
        Preparing
    };

    let $$={
        start(){

            connection.on("BazargahOrder", async (order)=> {
                let {services,SetState,bazargah,showMessage} = getState();                
                let time = bazargah.forsate_akhze_sefareshe_bazargah;
                order = await services({type:'bazargahItem',parameter:{order,time,type:'wait_to_get'}})
                if(order === false){return;}
                bazargah.wait_to_get = bazargah.wait_to_get || [];
                bazargah.wait_to_get.push(order);
                showMessage('سفارش جدیدی در بازارگاه دارید')
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