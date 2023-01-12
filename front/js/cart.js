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
                updatedProduct["quantity"] = updatedQuantity;

                //mise à jour du produit dans le cart
                if( updatedProduct["id"] == cart[i]["id"] && updatedProduct["chosenColor"] == cart[i]["chosenColor"] ) { //sur le produit du cart correspondant à l'objet avec la quantité mise à jour
                    
                    cart[i]["quantity"] = updatedQuantity; //on met à jour la quantité
                    // ajout du cart dans le local storage
                    window.localStorage.setItem("cart", JSON.stringify(cart));

                    //recalcul du prix de l'article
                    
                    console.log(document.getElementsByClassName("cart__item__content__description"));
                    console.log(document.getElementsByClassName("cart__item__content__description").lastElementChild);
                    //document.getElementsByClassName("cart__item__content__description").lastElementChild.textContent = matchingProduct["price"]*cart[i]["quantity"]+" €";

                }

              });

            var cart__item__content__settings__delete = document.createElement("div");
            cart__item__content__settings__delete.setAttribute("class", "cart__item__content__settings__delete");
            
            // bouton de suppression d'un élément du panier
            var deleteItem = document.createElement("p");
            deleteItem.setAttribute("class", "deleteItem");
            deleteItem.innerHTML = "Supprimer";

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