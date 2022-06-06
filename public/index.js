const socket = io();

//Comento todo el bloque de mensajes
/* const sendMessage = () => { */
/*     const email = document.getElementById("email").value; */
/*     const date = String(new Date().toDateString() + new Date().toLocaleTimeString()); */
/*     const text = document.getElementById("text").value; */
/*     const message = { email, date, text }; */
/*     socket.emit("newMessage", message); */
/*     return false; */
/* } */
/*  */
/* const showMessage = (message) => { */
/*     const { email, date, text } = message; */
/*     return ` */
/*         <div style="display:flex"> */
/*             <strong style="color:blue">${email}</strong>  */
/*             <p style="color:brown">${date}</p> */
/*             <i style="color:green"> : ${text}</i> */
/*         </div> */
/*     `; */
/* }; */
/*  */
/* const addMessage = (messages) => { */
/*     const allMessages = messages.map(message => showMessage(message)).join(" "); */
/*     document.getElementById("messages").innerHTML = allMessages; */
/* }; */
/*  */
/* socket.on('messages', (messages) => { */
/*     addMessage(messages); */
/* }); */