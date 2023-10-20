// requête la liste des produits et les affiche dans la console

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) { // vérifie que la requête s'est bien passée
      return res.json(); // récupère la réponse en json
    }
  })
  .then(function (productList) {
    // parcours tous les produits de la réponse et fait les actions pour chaque produit dans la réponse
    for (let i in productList) {

      //création des variables pour stocker les infos de l'article
      var productUrl = "./product.html?id=" + productList[i]._id;
      var imageUrl = productList[i].imageUrl;
      var altTxt = productList[i].altTxt;
      var productName = productList[i].name;
      var productDescription = productList[i].description;

      //création du bloc html et utilisation des variables pour insérer les infos
      document.getElementById("items").innerHTML += 
      `
        <a href="${productUrl}">
              <article>
                <img src="${imageUrl}" alt="${altTxt}">
                <h3 class="productName">${productName}</h3>
                <p class="productDescription">${productDescription}</p>
              </article>
        </a>
      `
    }

  })
  .catch(function (err) {
    console.log(err);// Une erreur est survenue
  });