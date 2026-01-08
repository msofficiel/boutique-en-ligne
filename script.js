const products = [
    { id: 1, nom: "Clavier", prix: 29.99, categorie: "Informatique", image: "clavier.jpg" },
    { id: 2, nom: "Souris", prix: 19.99, categorie: "Informatique", image: "souris.jpg" },
    { id: 3, nom: "T-shirt", prix: 14.99, categorie: "Vetement", image: "tshirt.jpg" },
    { id: 4, nom: "Casquette", prix: 9.99, categorie: "Accessoire", image: "casquette.jpeg" },
    { id: 5, nom: "Sweat", prix: 34.99, categorie: "Vetement", image: "sweat.jpg" }
];

function getCart() {
    return JSON.parse(localStorage.getItem("panier")) || [];
}

function saveCart(cart) {
    localStorage.setItem("panier", JSON.stringify(cart));
}

function updateCartCountDisplay() {
    let span = document.getElementById("cart-count");
    if (span) {
        span.textContent = getCart().length;
    }
}

function addToCart(id) {
    let cart = getCart();
    let product = products.find(p => p.id === id);
    if (!product) return;
    cart.push(product);
    saveCart(cart);
    updateCartCountDisplay();
    alert(product.nom + " a été ajouté au panier.");
}

function removeFromCart(index) {
    let panier = getCart();
    panier.splice(index, 1);
    saveCart(panier);
    updateCartCountDisplay();
    location.reload();
}

function renderProducts(category = "Toutes") {
    let container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = "";

    let list = products;

    if (category !== "Toutes") {
        list = products.filter(p => p.categorie === category);
    }

    if (list.length === 0) {
        container.textContent = "Aucun produit pour cette catégorie.";
        return;
    }

    list.forEach(p => {
        let div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML =
            "<img src='" + p.image + "' class='product-img'>" +
            "<h3>" + p.nom + "</h3>" +
            "<p class='product-category'>" + p.categorie + "</p>" +
            "<p class='product-price'>" + p.prix.toFixed(2) + " €</p>" +
            "<button onclick='addToCart(" + p.id + ")'>Ajouter au panier</button>";

        container.appendChild(div);
    });
}

function initIndexPage() {
    let select = document.getElementById("category-filter");
    if (!select) return;

    renderProducts();

    select.addEventListener("change", function () {
        renderProducts(select.value);
    });
}

function initProduitsPage() {
    let container = document.getElementById("cart-items");
    let totalEl = document.getElementById("cart-total");
    let btnClear = document.getElementById("btn-clear-cart");
    if (!container) return;

    let cart = getCart();
    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.textContent = "Votre panier est vide.";
        totalEl.textContent = "Total : 0.00 €";
        if (btnClear) btnClear.disabled = true;
        return;
    }

    cart.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML =
            "<span>" + item.nom + " - " + item.prix.toFixed(2) + " €</span>" +
            "<button onclick='removeFromCart(" + index + ")'>Supprimer</button>";
        container.appendChild(div);
        total += item.prix;
    });

    totalEl.textContent = "Total : " + total.toFixed(2) + " €";

    if (btnClear) {
        btnClear.onclick = function () {
            localStorage.removeItem("panier");
            updateCartCountDisplay();
            location.reload();
        };
    }
}

function initReclamationPage() {
    let form = document.getElementById("reclamation-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let nom = document.getElementById("nom").value.trim();
        let email = document.getElementById("email").value.trim();
        let numero = document.getElementById("numero-commande").value.trim();
        let message = document.getElementById("message").value.trim();
        let conditions = document.getElementById("conditions").checked;

        let error = document.getElementById("form-error");
        let success = document.getElementById("form-success");

        error.textContent = "";
        success.textContent = "";

        if (nom === "" || email === "" || !email.includes("@") || numero === "" || message.length < 10 || !conditions) {
            error.textContent = "Veuillez remplir correctement tous les champs.";
        } else {
            success.textContent = "Merci " + nom + ", votre réclamation a été envoyée !";
            form.reset();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCountDisplay();

    if (document.body.classList.contains("page-index")) {
        initIndexPage();
    }

    if (document.body.classList.contains("page-produits")) {
        initProduitsPage();
    }

    if (document.body.classList.contains("page-reclamation")) {
        initReclamationPage();
    }
});