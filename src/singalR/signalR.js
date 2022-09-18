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

    let $$={
        start(){

            connection.on("BazargahOrder", function (o) {
                let {services,SetState,bazargahItems,showMessage} = getState();                
                let order = services({parameter:o})
                bazargahItems.push(order);
                showMessage('سفارش جدیدی در بازارگاه دارید')
                SetState({bazargahItems})
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