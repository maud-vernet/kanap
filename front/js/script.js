// requête la liste des produits et les affiche dans la console

fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) { // vérifie que la requête s'est bien passée
      return res.json(); // récupère la réponse en json
    }
  })
  .then(function(productList) {
    // parcours tous les produits de la réponse et fait les actions pour chaque produit dans la réponse
    for (let i in productList) {

      // création d'un dans la section id items avec l'url du produit (début url fix + id du produit)
      var a = document.createElement("a");
      var productId = productList[i]._id;
      a.setAttribute("href", "./product.html?id="+productId);
      document.getElementById("items").appendChild(a);

      // création d'un article dans chaque a
      var article = document.createElement("article");
      a.appendChild(article);

      // création d'une image dans chaque a et ajout de la src et d'un alt pour chaque img
      var img = document.createElement("img");
      var imageUrl = productList[i].imageUrl;
      img.setAttribute("src", imageUrl);
      var altTxt = productList[i].altTxt;
      img.setAttribute("alt", altTxt);
      article.appendChild(img);

      // création d'un h3 de class productName dans chaque a et remplissage avec le nom du produit
      var h3 = document.createElement("h3");
      h3.classList.add("productName");
      h3.innerHTML= productList[i].name;
      article.appendChild(h3);

      // création d'un p de class productName dans chaque a et remplissage avec la description du produit
      var p = document.createElement("p");
      p.classList.add("productDescription");
      p.innerHTML= productList[i].description;
      article.appendChild(p);
   }
   
  })
  .catch(function(err) {
    console.log(err);// Une erreur est survenue
  });