// tableau contenant la liste des produits du panier qui sera stocké dans le local storage
const cart = [];

let params = new URLSearchParams("https://example.com/?name=Jonathan&age=18");
let toto = params.get("name"); // is the string "Jonathan"
let age = parseInt(params.get("age"), 10); // is the number 18
console.log(toto);

    var str = "https://example.com/?name=Jonathan&test=18";
var url = new URL(str);
var name = url.searchParams.get("name");
console.log(name);

// récupération de l'url courante
var str = window.location.href;
console.log(str);
var url = new URLSearchParams(str);

// si le paramètre id est présent dans l'url, on le récupère
if(url.has("id")) {
    var id = url.get("id");
    console.log(id);
    var baseUrl = "http://localhost:3000/api/products/";
    console.log(baseUrl.concat('', id));
}

// requête un produit en concatenant l'url de base + l'id du produit récupéré depuis l'url courante
fetch(baseUrl.concat('', id))
        .then(function(res) {
            if (res.ok) { // vérifie que la requête s'est bien passée
            return res.json(); // récupère la réponse en json
            }
        })
        .then(function(productDetails) {
            console.log(productDetails);

            // ajout des infos de la réponse dans la page pour afficher les infos sur le produit

            // ajout de l'img du produit avec son alt
            var productImg = document.createElement("img");
            productImg.setAttribute("src", productDetails.imageUrl);
            productImg.setAttribute("alt", productDetails.altTxt);
            document.querySelector(".item__img").appendChild(productImg);

            // ajout du nom, prix et description
            document.getElementById("title").innerText = productDetails.name;
            document.getElementById("price").innerText = productDetails.price;
            document.getElementById("description").innerText = productDetails.description;
            
            // parcours le tableau des couleurs et ajouter les couleurs dans la liste des options
            for(let i in productDetails.colors) {
                var color = document.createElement("option");
                color.setAttribute("value", productDetails.colors[i]);
                color.innerText = productDetails.colors[i];
                document.getElementById("colors").appendChild(color);
            }

            
        })
        .catch(function(err) {
            console.log(err);// Une erreur est survenue
            });


//ajout de l'article au panier (local storage)

//quand l'utilisateur clique sur la bouton ajouter au panier
document.getElementById("addToCart").addEventListener('click', function() {

    //récupération des infos id (déjà stocké dans la variable id), quantité et couleur du produit et stockage

    //objet pour l'item à ajouter au panier
    const newItem = {
        id : "toto",
        quantity : "tata",
        chosenColor : "titi" 
      }

    // ajout des infos id, quantité et couleur du produit dans l'objet
    newItem["id"] = id;
    newItem["quantity"] = document.getElementById('quantity').value;
    newItem["chosenColor"] = document.getElementById('colors').value;

    console.log(newItem);

    // ajout de l'objet dans le tableau
    cart.push(newItem);
    console.log(cart);
    
    // ajout du tableau dans le local storage
    window.localStorage.setItem("cart", JSON.stringify(cart));
    
    //récupération du cart dans le local storage
    var localStorageCart = JSON.parse(localStorage.getItem('cart'));
    console.log(localStorageCart);

    for(let i in localStorageCart) {
        console.log(cart[i].id);
        console.log(cart[i].quantity);
        console.log(cart[i].chosenColor);

        if(id == localStorageCart[i].id && document.getElementById('colors').value == localStorageCart[i].chosenColor) {
            console.log('nouvelle quantité');
        }
        else { //sinon ajout d'un nouvel objet dans le local storage avec l'id, la quantité et la couleur
            console.log('nouveau produit');
        }
}


});


