const prisma = require('@libs/prisma');

let products = [];

const imageList = [
  'https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/7/26/994e9b67-8c58-4a0b-9b52-4fdc2894221b.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/2/5/b43ad892-e0ef-4522-ae29-41d210905817.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/2/5/b43ad892-e0ef-4522-ae29-41d210905817.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/6/1/03fc67d5-0c64-4351-b1ac-00cd3a82d0fd.jpg',
  'https://images.tokopedia.net/img/cache/900/product-1/2020/7/30/16226024/16226024_dc2c3bd6-ef33-4a46-8245-b5c5bc9119d2_700_700',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/4/3/74f440ae-9d7d-411d-8ce4-914dc61e8833.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/6/12/b7b2db62-cc80-46f0-8fa9-6c96ff834446.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/12/28/ffa38a17-9d7e-45a7-9237-0beb7d979d17.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/3/21/80038c7e-b4fc-48ed-8627-db264da239ce.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/7e3f6617-598f-4479-8c29-2ae8a4a70606.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/12/8/6f523027-96dd-42e9-8563-0111ea0a14a4.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/2/18/6a6ff7ae-338b-4e1c-b1b9-84c153781249.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/10/26/ccc6ced9-9f5e-4362-9bca-0a27cf26bb7e.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2020/9/27/dbabe972-2ad4-4eb8-890a-a0bca500d1d8.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/3/da08d344-4a37-426e-8d1e-5462d4653f5a.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/12/26/49eaf942-e777-4026-8d8c-1aa1cabef2fe.png',
  'https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/5/3/819a020e-c50c-46f3-aa5d-2d9816c5527b.png',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/4/2/689707d1-d8ec-450a-a218-ec3e6ccdd8bc.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/5/16/b41a4443-8db1-4289-9925-599bce504377.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/10/51a81eb3-7c49-4255-9aac-4e7c3246016a.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/21/b3b2c09f-894e-4aeb-a3fc-dbcf92b4be80.png',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/17/271a0c74-648f-449a-91b8-e03a20743c7e.png',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/7/21/c7d103aa-6e2e-41bc-9862-6e3fa6e1a49e.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2020/11/3/96d28387-36e9-4685-8ac9-abc3a96a003c.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/12/4/ac11f268-6aa6-4ea0-a13e-0d670ac57eed.jpg',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/5/4/9d9985e9-d459-4cc4-b7c7-a04aea8abc0b.jpg',
]

for (let i = 1; i <= 50; i++) {
  products.push({
    name: `Product ${i}`,
    description: `Description of Product ${i}`,
    totalStock: Math.floor(Math.random() * 100) + 1,
    price: Math.floor(100 + Math.random() * 900) * 100,
    imageUrl: imageList[i%imageList.length]
  });
}

async function seedProducts() {
  try {
    await prisma.product.createMany({
      data: products,
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = seedProducts;

// let products = [
//   {
//     name: 'PediaComplete Vanila',
//     description:
//       'PEDIASURE COMPLETE VANILLA merupakan nutrisi untuk mendukung pertumbuhan anak. Untuk anak usia 1-10 tahun.',
//     totalStock: 105,
//     price: 380000,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/hDjmkQ/2024/5/6/c1c0afd4-62ce-40d9-a4d6-9f9c0479a8af.jpg',
//   },
//   {
//     name: 'Enfagrow A+ Gentle Care Susu Formula',
//     description:
//       'Enfagrow A+ Gentle Care adalah susu pertumbuhan untuk anak usia 1 hingga 3 tahun.',
//     totalStock: 50,
//     price: 1310900,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/21/b3b2c09f-894e-4aeb-a3fc-dbcf92b4be80.png',
//   },
//   {
//     name: 'DOT BOTOL KUCING PUTIH',
//     description:
//       'DOT PUTIH Botol Susu Anjing Kucing Bayi Baru Lahir Kitten Kecil Murah Tempat Minum Anak hewan 60ml.',
//     totalStock: 1200,
//     price: 8000,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
//   },
//   {
//     name: 'Kursi Makan Bayi',
//     description:
//       'Cocok untuk anak yang sedang latihan duduk dan mempermudah anak untuk diajak makan. Mudah untuk di tiup serta bisa di kemas ulang. Cocok untuk di bawa saat travelling',
//     totalStock: 80,
//     price: 59000,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/7/14/9a2a1d2f-75e3-4635-9ad1-5ca82b507608.jpg',
//   },
//   {
//     name: 'Cussons Baby Oil 100 ml',
//     description:
//       'Cussons Baby Oil Merupakan Minyak Mineral Murni Dengan Wangi Khas Bayi Yang Lembut Untuk Menambah Kelembaban Pada Kulit Bayi Dan Membantu Menghilangkan Kerak Pada Kulit Kepala Bayi.',
//     totalStock: 90,
//     price: 19523,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/12/24/99527fa2-615f-4106-913c-66e137abe249.jpg',
//   },
//   {
//     name: 'Jumper Anak/Bayi JP02 SNI ',
//     description:
//       'Sebaiknya Diukur LD Anak Ya Moms, Karna Setiap Badan Anak Berbeda-beda, Umur Hanya Perkiraan.',
//     totalStock: 75,
//     price: 27500,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/2/7204df6f-01dd-4b48-9974-2a992d8776ba.jpg',
//   },
//   {
//     name: 'MAMA CHOICE BODY LOTION',
//     description:
//       '9 dari 10 Mama setuju, lotion ini efektif dalam menyamarkan bekas gigitan nyamuk atau serangga dalam 4 hari!',
//     totalStock: 999,
//     price: 66640,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/2/28/d7a49eb2-6cd1-452c-b503-986dcaae73a8.png',
//   },
//   {
//     name: 'MOM BABY Ekonomis Diaper Pants',
//     description: 'MOM BABY Ekonomis Diaper Pants Popok Celana Bayi, Tersedia dalam 3 ukuran',
//     totalStock: 80,
//     price: 42900,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/hDjmkQ/2024/2/24/07e97b4b-3992-44ee-92b5-982548bdb168.png',
//   },
//   {
//     name: 'Tas Baby Carrier Hipseat',
//     description:
//       'Tas untuk mengendong bayi ini terbuat dari bahan kain Oxford yang lembut sehingga bayi Anda tidak akan merasa sakit dan terluka akibat gesekan-gesekan dengan tas ini.',
//     totalStock: 190,
//     price: 48888,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/23/3b38658a-23e1-49d8-abb3-1d5974f3b315.jpg',
//   },
//   {
//     name: 'Mamas&Papas Airo Stroller Black',
//     description: 'Versatile tablet for work and entertainment',
//     totalStock: 80,
//     price: 3999000,
//     imageUrl:
//       'https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/7/26/994e9b67-8c58-4a0b-9b52-4fdc2894221b.jpg',
//   },
// ];
