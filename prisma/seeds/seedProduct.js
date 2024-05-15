const prisma = require('@libs/prisma');

let products = [];

for (let i = 1; i <= 50; i++) {
  products.push({
    name: `Product ${i}`,
    description: `Description of Product ${i}`,
    totalStock: Math.floor(Math.random() * 100) + 1,
    price: Math.floor(100 + Math.random() * 900) * 100,
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/7/26/994e9b67-8c58-4a0b-9b52-4fdc2894221b.jpg',
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
