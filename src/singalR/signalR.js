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

export default function SignalR() {
    
    var connection = new HubConnectionBuilder().withUrl("https://localhost:44339/hubclient").build();

    let $$={
        start(){

            connection.on("ReceiveMessage", function (message) {
                console.log(message);
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