export const commandes = [
  {
    id: 1,
    numeroTable: 4,
    status: "attente",
    dateCommande: "08/07/2026 12:00",
    nature: "place",
    plats: [
      {idProduit: 2 , label: "Bacon Burger (sans oignons)", nbre: 2 },
      { idProduit: 4,label: "Frites Max", nbre: 1 },
      { idProduit: 1,label: "Coca zéro", nbre: 2 },
    ],
  },
  {
    id: 3,
    numeroTable: null,
    status: "cuisson",
    dateCommande: "08/07/2026 14:00",
    nature: "emporter",
    plats: [
      { idProduit: 1, label: "Queen Signature", nbre: 1 },
      { idProduit: 4, label: "Nuggets", nbre: 6 },
      { idProduit: 3, label: "Milkshake vanille", nbre: 1 },
    ],
  },
  {
    id: 2,
    numeroTable: 9,
    status: "attente",
    dateCommande: "08/07/2026 13:00",
    nature: "place",
    plats: [
      { idProduit: 2,label: "Cheeseburger", nbre: 3 },
      { idProduit: 3,label: "Frites classiques", nbre: 3 },
      { idProduit: 1,label: "Salade César", nbre: 1 },
    ],
  },
  
  {
    id: 4,
    numeroTable: null,
    status: "prete",
    dateCommande: "08/07/2026 16:00",
    nature: "emporter",
    plats: [
      { idProduit: 2, label: "Double Bacon (extra cheddar)", nbre: 2 },
      { idProduit: 1, label: "Queen Signature", nbre: 1 },
    ],
  },
];

export const burgers = [
  {
    id:1 ,
    title : "Queen Signature",
    desc: [
      "Steak 180g",
      "cheddar",
      "sauce maison"
    ] ,
    price:12.90 ,
    img:"🍔" ,
    disponible:true ,
    categoryId: "cat001",
        recette: [
            { ingredientId: "ing001", quantiteUtilisee: 0.15 },
            { ingredientId: "ing002", quantiteUtilisee: 0.03 },
        ],
  } ,
  {
    id:2 ,
    title : "Bacon Deluxe",
    desc: [
      "Double bacon fumé",
      "oignons",
      "tomate"
    ] ,
    price:13.50 ,
    img:"🥓" ,
    disponible:true ,
    categoryId: "cat001",
    recette: [
            { ingredientId: "ing005", quantiteUtilisee: 0.15 },
            { ingredientId: "ing006", quantiteUtilisee: 0.03 }, 
            { ingredientId: "ing007", quantiteUtilisee: 0.03 }, 
        ],
  },
  {
    id:3 ,
    title : "Cheddar Classic",
    desc: [
      "Le grand classique",
      "généreux",
    ] ,
    price:9.90 ,
    img:"🧀" ,
    disponible:false ,
    categoryId: "cat001",
        recette: [
            { ingredientId: "ing002", quantiteUtilisee: 0.15 },
            { ingredientId: "ing008", quantiteUtilisee: 0.03 }, 
        ],
  },
  {
    id:4 ,
    title : "Veggie Garden",
    desc: [
      "Galette légumes",
      "avocat",
      "roquette"
    ] ,
    price:11.90 ,
    img:"🥑" ,
    disponible:true ,
    categoryId: "cat001",
        recette: [
            { ingredientId: "ing009", quantiteUtilisee: 0.15 },
            { ingredientId: "ing0010", quantiteUtilisee: 0.03 }, 
        ],
  },
  {
    id:5 ,
    title : "Spicy Chick",
    desc: [
      "Poulet croustillant",
      "sauce piquante",
    ] ,
    price:11.90 ,
    img:"🌶️" ,
    disponible:false ,
    categoryId: "cat001",
        recette: [
            { ingredientId: "ing003", quantiteUtilisee: 0.15 },
            { ingredientId: "ing004", quantiteUtilisee: 0.10 },
        ],
  }
]

// data/mockCategories.js
export const mockCategories = [
    { id: "cat001", nom: "Burger", icone: "hamburger", ordre: 1 },
    { id: "cat002", nom: "Boisson", icone: "cup", ordre: 2 },
];

// data/mockIngredients.js
export const mockIngredients = [
    { id: "ing001", label: "Bœuf haché", quantiteActuelle: 3.2, quantiteMax: 5, unite: "kg", seuilAlerte: 1 ,categoriesCompatibles: ["cat_burger"] },
    { id: "ing002", label: "Cheddars", quantiteActuelle: 0.05, quantiteMax: 2, unite: "kg", seuilAlerte: 0.2, categoriesCompatibles: ["cat_burger"] },
    { id: "ing003", label: "Piments", quantiteActuelle: 100, quantiteMax: 300, unite: "kg", seuilAlerte: 0.2 , categoriesCompatibles: ["cat_burger"]},
    { id: "ing004", label: "Poulets", quantiteActuelle: 0.05, quantiteMax: 10, unite: "kg", seuilAlerte: 0.2, categoriesCompatibles: ["cat_burger"] },
    { id: "ing005", label: "Oignons", quantiteActuelle: 0.05, quantiteMax: 10, unite: "kg", seuilAlerte: 0.2,categoriesCompatibles: ["cat_burger"] },
    { id: "ing006", label: "Double bacon fumé", quantiteActuelle: 0.05, quantiteMax: 10, unite: "kg", seuilAlerte: 0.2, categoriesCompatibles: ["cat_burger"] },
    { id: "ing007", label: "Tomates", quantiteActuelle: 0.05, quantiteMax: 10, unite: "kg", seuilAlerte: 0.2 , categoriesCompatibles: ["cat_burger"]},
    { id: "ing008", label: "Huile", quantiteActuelle: 0.05, quantiteMax: 10, unite: "L", seuilAlerte: 0.2, categoriesCompatibles: ["cat_burger"] },
    { id: "ing009", label: "Avocat", quantiteActuelle: 0.09, quantiteMax: 10, unite: "Kg", seuilAlerte: 0.5, categoriesCompatibles: ["cat_burger"] },
    { id: "ing0010", label: "Roquette", quantiteActuelle: 10, quantiteMax: 10, unite: "Kg", seuilAlerte: 0.5, categoriesCompatibles: ["cat_burger"] },
        { id: "ing0011", label: "Mangues", quantiteActuelle: 10, quantiteMax: 10, unite: "Kg", seuilAlerte: 5, categoriesCompatibles: ["cat_boisson"] },






];

// data/mockProduits.js
export const mockProduits = [
    {
        id: "brg001",
        title: "Queen BBQ",
        img: "🍔",
        desc: ["boeuf", "cheddar", "bacon"],
        price: 9.90,
        categoryId: "cat001",
        recette: [
            { ingredientId: "ing001", quantiteUtilisee: 0.15 },
            { ingredientId: "ing002", quantiteUtilisee: 0.03 },
        ],
        disponible: true, // calculé "à la main" pour l'instant, en dur
    },
];