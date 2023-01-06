//fonction pour charger le panier qui est enregistré dans le local storage

export function cartLoading() {
    if (localStorage.getItem('cart') !== null) {
        console.log('panier déjà existant dans le local storage');
        var cart = JSON.parse(localStorage.getItem('cart'));
    } else {
        console.log('aucun panier dans le local storage');
        var cart = [];
    }
  }



