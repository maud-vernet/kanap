//récupération du cart dans le local storage si présent
if (localStorage.getItem('cart') !== null) {
    var cart = JSON.parse(localStorage.getItem('cart'));
    
    
    // requête la liste des produits et les affiche dans la console
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
    if (res.ok) { // vérifie que la requête s'est bien passée
        return res.json(); // récupère la réponse en json
    }
    })
    .then(function(productList) {

        // tableau pour stocker les prix des items du cart
        var cartItemPrice = [];

        //objet pour mettre à jour la quantité d'un produit dans le panier
        const updatedProduct = {
            id : "id",
            quantity : 0,
            chosenColor : "color" 
        }

        //objet pour  supprimer un produit dans le panier
        const productToDelete = {
            id : "id",
            quantity : 0,
            chosenColor : "color" 
        }
        
        // pour chaque produit du cart
        for(let i in cart) {
            //stockage de l'id
            var cartItemId = cart[i].id ;

            var matchingProduct = null;

            //recherche dans la liste complète des produits venant le l'API
            for (let i in productList) {
                if(cartItemId == productList[i]._id) { //si l'id d'un des produit correspond à celle de l'élément du cart
                    matchingProduct = productList[i]; // on stocke ce produit (il sera utilisé pour récupérer des infos plus bas comme l'img)
                }
            }

            //remplissage du tableau cartItemPrice
            cartItemPrice.push(matchingProduct["price"]*cart[i].quantity);
            
            //création d'un article dans #cart__items
            var article = document.createElement("article");
            article.setAttribute("class", "cart__item");
            article.setAttribute("data-id", cart[i].id);
            article.setAttribute("data-color", cart[i].chosenColor);
            document.getElementById("cart__items").appendChild(article);

            //création de l'image du produit et insertion dans l'article
            var cart__item__img = document.createElement("div");
            cart__item__img.setAttribute("class", "cart__item__img");
            var productImg = document.createElement("img");
            productImg.setAttribute("src", matchingProduct["imageUrl"]);
            productImg.setAttribute("alt", matchingProduct["altTxt"]);
            cart__item__img.appendChild(productImg);
            article.appendChild(cart__item__img);

            //création des infos du produit (nom, prix, etc) et insertion dans l'article
            var cart__item__content = document.createElement("div");
            cart__item__content.setAttribute("class", "cart__item__content");
            var cart__item__content__description = document.createElement("div");
            cart__item__content__description.setAttribute("class", "cart__item__content__description");
            var h2 = document.createElement("h2");
            h2.innerHTML = matchingProduct["name"];
            var colorP = document.createElement("p");
            colorP.innerHTML = cart[i].chosenColor;
            var priceP = document.createElement("p");
            priceP.innerHTML = matchingProduct["price"]*cart[i].quantity+" €";
            cart__item__content__description.appendChild(h2);
            cart__item__content__description.appendChild(colorP);
            cart__item__content__description.appendChild(priceP);
            cart__item__content.appendChild(cart__item__content__description);
            article.appendChild(cart__item__content);

            //création de la quantité et insertion dans l'article
            var cart__item__content__settings = document.createElement("div");
            cart__item__content__settings.setAttribute("class", "cart__item__content__settings");
            var cart__item__content__settings__quantity = document.createElement("div")
            cart__item__content__settings__quantity.setAttribute("class", "cart__item__content__settings__quantity");
            var qtyP = document.createElement("p");
            qtyP.innerHTML = "Qté : ";
            
            //champs pour la quantité de l'article
            var qtyNumber = document.createElement("input");
            qtyNumber.setAttribute("type", "number");
            qtyNumber.setAttribute("name", "itemQuantity");
            qtyNumber.setAttribute("min", "1");
            qtyNumber.setAttribute("max", "100");
            qtyNumber.setAttribute("value", cart[i].quantity);
            //écoute du changement de quantité d'un article
            qtyNumber.addEventListener('change', (event) => {
                // récupération de la nouvelle quantité
                var updatedQuantity = parseInt(event.target.value);

                //maj de l'objet updatedProduct avec les infos du produit et la nouvelle quantité
                updatedProduct["id"] = cart[i].id;
                updatedProduct["chosenColor"] = cart[i].chosenColor;
                
                //mise à jour du produit dans le cart
                if( updatedProduct["id"] == cart[i]["id"] && updatedProduct["chosenColor"] == cart[i]["chosenColor"] ) { //sur le produit du cart correspondant à l'objet avec la quantité mise à jour
                    
                    cart[i]["quantity"] = updatedQuantity; //on met à jour la quantité
                    // ajout du cart dans le local storage
                    window.localStorage.setItem("cart", JSON.stringify(cart));
                    
                }

                // rechargement de  la page pour recalcul du prix de l'article et du prix total
                location.reload();

              });

            var cart__item__content__settings__delete = document.createElement("div");
            cart__item__content__settings__delete.setAttribute("class", "cart__item__content__settings__delete");
            
            // bouton de suppression d'un élément du panier
            var deleteItem = document.createElement("p");
            deleteItem.setAttribute("class", "deleteItem");
            deleteItem.innerHTML = "Supprimer";
            //écoute du bouton de suppression
            deleteItem.addEventListener('click', function() {
            
            //suppression de l'article de l'html
            deleteItem.closest("article").remove();
            //stockage de l'id et de la couleur de ce produit
            productToDelete["id"] = cart[i].id;
            productToDelete["chosenColor"] = cart[i].chosenColor;

            if( productToDelete["id"] == cart[i]["id"] && productToDelete["chosenColor"] == cart[i]["chosenColor"] ) { //pour le produit du cart qui a le même id et la même couleur que l'élément à supprimer

                cart.splice(i,1); //suppression du produit du tableau
                // ajout du cart dans le local storage
                window.localStorage.setItem("cart", JSON.stringify(cart));
            }

            location.reload();

            });
            
            cart__item__content__settings__quantity.appendChild(qtyP);
            cart__item__content__settings__quantity.appendChild(qtyNumber);
            cart__item__content__settings.appendChild(cart__item__content__settings__quantity);
            cart__item__content__settings__delete.append(deleteItem);
            cart__item__content__settings.appendChild(cart__item__content__settings__delete);
            article.appendChild(cart__item__content__settings);

            //somme des éléments d'un tableau (utilisé sur cartItemPrice pour avoir le prix total du panier)
            function sumArray(array) {
                let sum = 0; 
            
                /*loop over array and add each item to sum
                */
                for (const item of array) {
                sum += item;
                }
            
            // return the result 
                return sum;
            }
            
            //ajout du prix total à l'élément html correspondant
            document.getElementById("totalPrice").innerHTML = sumArray(cartItemPrice);
        
        }
    
    })
    .catch(function(err) {
    console.log(err);// Une erreur est survenue
    });

} else {
    console.log('aucun panier dans le local storage');
}

//Vérification des données du formulaire

var nameRegex = /^[^0-9\/\\_\.]+$/;
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var addressRegex = /^[a-zA-Z0-9\s,'-]*$/;

// vérif des champs au moment de la saisie par l'utilisateur
document.getElementById("email").addEventListener("input", checkEmail);
document.getElementById("firstName").addEventListener("input", checkFirstName);
document.getElementById("lastName").addEventListener("input", checkLastName);
document.getElementById("address").addEventListener("input", checkAddress);
document.getElementById("city").addEventListener("input", checkCity);

//vérif au moment de l'envoi du formulaire
document.querySelector("form").addEventListener("submit", orderRequest);

function checkFirstName(e) {
    var value = document.getElementById("firstName").value;
    if (nameRegex.test(value)) {
        document.getElementById("firstNameErrorMsg").innerHTML = "";
        return true;
    } else {
        document.getElementById("firstNameErrorMsg").innerHTML = "Prénom invalide";
        return false;
    }
};

function checkLastName(e) {
    var value = document.getElementById("lastName").value;
    if (nameRegex.test(value)) {
        document.getElementById("lastNameErrorMsg").innerHTML = "";
        return true;
    } else {
        document.getElementById("lastNameErrorMsg").innerHTML = "Nom invalide";
        return false;
    }
};

function checkAddress(e) {
    var value = document.getElementById("address").value;
    if (addressRegex.test(value)) {
        document.getElementById("addressErrorMsg").innerHTML = "";
        return(true);
    } else {
        document.getElementById("addressErrorMsg").innerHTML = "Adresse invalide";
        return false;
    }
};

function checkCity(e) {
    var value = document.getElementById("city").value;
    if (nameRegex.test(value)) {
        document.getElementById("cityErrorMsg").innerHTML = "";
        return true;
    } else {
        document.getElementById("cityErrorMsg").innerHTML = "ville invalide";
        return false;
    }
}

function checkEmail(e) {
    var value = document.getElementById("email").value;
    if (emailRegex.test(value)) {
        document.getElementById("emailErrorMsg").innerHTML = "";
        return true;
    } else {
        document.getElementById("emailErrorMsg").innerHTML = "Email invalide";
        return false;
    }
}

function orderRequest(e) { //vérifie les différent champ et si ok, construit la requête pour la commande, l'envoi et redirige vers la page de commande
    e.preventDefault();
    if(checkFirstName() && checkLastName() && checkAddress() && checkCity() && checkEmail()) { //vérification des champs
        // construction objet contact
        var contact = {
            firstName : document.getElementById("firstName").value,
            lastName : document.getElementById("lastName").value,
            address : document.getElementById("address").value,
            city : document.getElementById("city").value,
            email : document.getElementById("email").value
        };
        // construction du tableau de produits
        var productTable = [];
        for (i in cart) { //pour chaque élément du cart

        var productId = null;
        for (qty = 1; qty <= cart[i].quantity; qty++) { //autant de fois qu'il y a de quantité de l'article
            productId = cart[i].id; // on stocke l'id
            productTable.push(productId); //on l'ajoute au tableau des produits
            }
        }

        //construction du corps de la requête pour la commande (objet contact et tableau des produits)
        var order = {"contact": contact, "products": productTable}

        //passage de la commande (envoi de la requête, récupération de l'id et redirection)
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
            })
            .then(function(res) {
                if (res.ok) { // vérifie que la requête s'est bien passée
                    return res.json(); // récupère la réponse en json
                }
                })
            .then(function(value) {
                //récupère l'id de la commande
                var orderId = value.orderId;

                //redirection : construction de l'url de redirection : url+orderId
                var redirectUrl = "./confirmation.html?orderId="+orderId;
                console.log(redirectUrl);
                document.location.href = redirectUrl
                
            })
            .catch(function(err) {
                console.log(err);// Une erreur est survenue
                });

    }
}