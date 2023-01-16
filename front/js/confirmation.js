//récupération de l'url
var urlParams = (new URL(window.location.href)).searchParams;
var orderId = encodeURI(urlParams.get("orderId"));

//ajout de l'orderId dans la page
document.getElementById("orderId").innerHTML = orderId;

