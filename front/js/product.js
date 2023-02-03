// récupération de l'url courante
var str = new URL(window.location.href).searchParams;
var baseUrl = "http://localhost:3000/api/products/";
var id = encodeURI(str.get("id"));

// requête un produit en concatenant l'url de base + l'id du produit récupéré depuis l'url courante
fetch(baseUrl.concat("", id))
  .then(function (res) {
    if (res.ok) {
      // vérifie que la requête s'est bien passée
      return res.json(); // récupère la réponse en json
    }
  })
  .then(function (productDetails) {
    // ajout des infos de la réponse dans la page pour afficher les infos sur le produit

    // ajout de l'img du produit avec son alt
    var productImg = document.createElement("img");
    productImg.setAttribute("src", productDetails.imageUrl);
    productImg.setAttribute("alt", productDetails.altTxt);
    document.querySelector(".item__img").appendChild(productImg);

    // ajout du nom, prix et description
    document.getElementById("title").innerText = productDetails.name;
    document.getElementById("price").innerText = productDetails.price;
    document.getElementById("description").innerText =
      productDetails.description;

    // parcours le tableau des couleurs et ajouter les couleurs dans la liste des options
    for (let i in productDetails.colors) {
      var color = document.createElement("option");
      color.setAttribute("value", productDetails.colors[i]);
      color.innerText = productDetails.colors[i];
      document.getElementById("colors").appendChild(color);
    }
  })
  .catch(function (err) {
    console.log(err); // Une erreur est survenue
  });

//ajout de l'article au panier (local storage)

//quand l'utilisateur clique sur la bouton ajouter au panier
document.getElementById("addToCart").addEventListener("click", function () {
  // ajout des infos id, quantité et couleur du produit dans l'objet
  var strQuantity = document.getElementById("quantity").value;
  var quantity = parseInt(strQuantity); //conversion de la quantité du formulaire (string) en integer
  var chosenColor = document.getElementById("colors").value;
  console.log(quantity);
  console.log(chosenColor);

  //si l'utilisateur a bien choisi une couleur et une quantité (entier entre 1 et 100 inclus)
  if (
    strQuantity === quantity.toString() &&
    quantity >= 0 &&
    quantity <= 101 &&
    chosenColor != ""
  ) {
    //récupération des infos id (déjà stocké dans la variable id), quantité et couleur du produit et stockage

    // tableau contenant la liste des produits du panier qui sera stocké dans le local storage

    if (localStorage.getItem("cart") !== null) {
      var cart = JSON.parse(localStorage.getItem("cart"));
    } else {
      var cart = [];
    }

    //objet pour l'item à ajouter au panier
    const newItem = {
      id: "toto",
      quantity: 0,
      chosenColor: "titi",
    };

    var cartItem = null;

    for (let i in cart) {
      //parcours le panier

      //recherche si on a un produit similaire dans le cart (même id et color)
      if (id == cart[i].id && chosenColor == cart[i].chosenColor) {
        cartItem = cart[i]; // cartItem devient l'élément trouvé (le produit similaire)
      }
    }

    if (cartItem === null) {
      //si pas de produit similaire trouvé (donc cartItem est resté null)
      newItem["id"] = id;
      newItem["chosenColor"] = chosenColor;
      newItem["quantity"] = quantity;

      // ajout de l'objet dans le tableau cart
      cart.push(newItem);
    } else {
      // mise à jour de la quantité sur l'élément trouvé ci-dessus
      cartItem["quantity"] += quantity; //on additionne la quantité du formulaire avec celle déjà enregistrée dans le produit similaire trouvé dans le cart
    }

    // ajout du tableau dans le local storage
    window.localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    alert(
      "Pour ajouter un article au panier, vous devez choisir une quantité entre 1 et 100 et une couleur."
    );
  }
});
