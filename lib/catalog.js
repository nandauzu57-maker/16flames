export const PRODUCTS = [
  {id:1,name:"Velour Zip Hoodie",price:89,category:"Tracksuits",sizes:["XS","S","M","L","XL","2XL"]},
  {id:2,name:"Heritage Velour Pant",price:79,category:"Tracksuits",sizes:["XS","S","M","L","XL","2XL"]},
  {id:3,name:"Bling Baby Tee",price:49,category:"Tops",sizes:["XS","S","M","L","XL"]},
  {id:4,name:"Butterfly Zip Jacket",price:99,category:"Jackets",sizes:["XS","S","M","L","XL","2XL"]},
  {id:5,name:"Crystal Shoulder Bag",price:79,category:"Bags",sizes:["OS"]},
  {id:6,name:"Glossy Mini Bag",price:69,category:"Bags",sizes:["OS"]},
  {id:7,name:"Charm Necklace",price:39,category:"Jewelry",sizes:["OS"]},
  {id:8,name:"Crystal Hoops",price:35,category:"Jewelry",sizes:["OS"]},
  {id:9,name:"Cloud Mini Skirt",price:59,category:"Bottoms",sizes:["XS","S","M","L","XL"]},
  {id:10,name:"Soft Logo Hoodie",price:85,category:"Tops",sizes:["XS","S","M","L","XL","2XL","3XL"]},
  {id:11,name:"Dream Velour Short",price:55,category:"Bottoms",sizes:["XS","S","M","L","XL"]},
  {id:12,name:"Star Charm Bracelet",price:42,category:"Jewelry",sizes:["OS"]},
  {id:13,name:"Cloud Runner Sneakers",price:109,category:"Shoes",sizes:["36","37","38","39","40","41","42","43","44"]},
  {id:14,name:"Logo Slide Sandals",price:59,category:"Shoes",sizes:["36","37","38","39","40","41","42"]}
];

export function getProduct(id){ return PRODUCTS.find(p => p.id === Number(id)); }
