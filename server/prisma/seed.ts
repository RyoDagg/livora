import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- USERS ---
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'ahmed.benali@example.com',
        password_hash: 'hashed',
        name: 'Ahmed Ben Ali',
        phone: '+216 22 111 222',
      },
      {
        email: 'syrine.khaldi@example.com',
        password_hash: 'hashed',
        name: 'Syrine Khaldi',
        phone: '+216 23 111 233',
      },
      {
        email: 'mohamed.trabelsi@example.com',
        password_hash: 'hashed',
        name: 'Mohamed Trabelsi',
        phone: '+216 24 111 244',
      },
      {
        email: 'ines.ghali@example.com',
        password_hash: 'hashed',
        name: 'Ines Ghali',
        phone: '+216 25 111 255',
      },
      {
        email: 'khaled.mejri@example.com',
        password_hash: 'hashed',
        name: 'Khaled Mejri',
        phone: '+216 26 111 266',
      },
    ],
    skipDuplicates: true,
  });

  const u1 = await prisma.user.findUnique({
    where: { email: 'ahmed.benali@example.com' },
  });
  const u2 = await prisma.user.findUnique({
    where: { email: 'syrine.khaldi@example.com' },
  });
  const u3 = await prisma.user.findUnique({
    where: { email: 'mohamed.trabelsi@example.com' },
  });
  const u4 = await prisma.user.findUnique({
    where: { email: 'ines.ghali@example.com' },
  });
  const u5 = await prisma.user.findUnique({
    where: { email: 'khaled.mejri@example.com' },
  });
  // --- LISTINGS ---
  const listings = [
    // ------------------------
    // U1 (Ahmed → 12 listings)
    // ------------------------
    {
      title: 'Spacious Apartment in Tunis Centre',
      description:
        '3 bedrooms, 2 bathrooms, 5th floor with elevator. Close to metro and shops.',
      price: 1500,
      state: 'Tunis',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'Maison familiale à Sfax',
      description:
        'Grande maison de 220m² avec jardin. Quartier calme, proche école primaire.',
      price: 230000,
      state: 'Sfax',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'دار للبيع في سوسة',
      description:
        'دار كبيرة في سوسة قريبة للبحر و للسوق. مساحة واسعة تصلح لعائلة.',
      price: 180000,
      state: 'Sousse',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'Cozy Studio in La Marsa',
      description:
        'Fully furnished studio ideal for students. 5 min walk from the beach.',
      price: 700,
      state: 'Tunis',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'Appartement à louer à Ariana',
      description:
        'Appartement S+2 au 2ème étage. Climatisé, proche transport.',
      price: 900,
      state: 'Ariana',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'Penthouse with Sea View',
      description:
        'Luxurious penthouse with panoramic sea view. Large terrace and modern design.',
      price: 5000,
      state: 'Tunis',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'Maison à vendre à Mahdia',
      description: 'Belle maison traditionnelle proche de la médina.',
      price: 150000,
      state: 'Mahdia',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'دار للكراء في بنزرت',
      description: 'دار صغيرة بنظام S+1، قريبة من البحر.',
      price: 400,
      state: 'Bizerte',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'Modern Office in Lac 2',
      description: '80m² open space with parking, perfect for startups.',
      price: 2000,
      state: 'Tunis',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'Terrain à vendre à Zaghouan',
      description: 'Terrain agricole de 5000m² avec accès route.',
      price: 75000,
      state: 'Zaghouan',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'House for Sale in Gabès',
      description: '2 floors, spacious living room, near city center.',
      price: 95000,
      state: 'Gabès',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },
    {
      title: 'دار جديدة في قفصة',
      description: 'دار جديدة مازال ما تسكنت، حي هادئ.',
      price: 80000,
      state: 'Gafsa',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 22 111 222',
      imageURL: '',
      ownerId: u1!.id,
    },

    // ------------------------
    // U2 (Syrine → 5 listings)
    // ------------------------
    {
      title: 'Modern Villa in Hammamet',
      description: 'Luxury villa with swimming pool, 4 bedrooms, sea view.',
      price: 450000,
      state: 'Nabeul',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 23 111 233',
      imageURL: '',
      ownerId: u2!.id,
    },
    {
      title: 'Appartement à vendre à La Goulette',
      description: 'Appartement S+3, vue sur mer. Idéal pour vacances.',
      price: 280000,
      state: 'Tunis',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 23 111 233',
      imageURL: '',
      ownerId: u2!.id,
    },
    {
      title: 'Charming Studio in Monastir',
      description: 'Ideal for students, 1 bedroom, furnished.',
      price: 600,
      state: 'Monastir',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 23 111 233',
      imageURL: '',
      ownerId: u2!.id,
    },
    {
      title: 'دار للبيع في القيروان',
      description: 'دار قديمة محتاجة تصليح، في قلب المدينة العتيقة.',
      price: 40000,
      state: 'Kairouan',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 23 111 233',
      imageURL: '',
      ownerId: u2!.id,
    },
    {
      title: 'Apartment in Sidi Bou Said',
      description:
        'Charming apartment with traditional architecture and blue-white design.',
      price: 1200,
      state: 'Tunis',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 23 111 233',
      imageURL: '',
      ownerId: u2!.id,
    },

    // ------------------------
    // U3 (Mohamed → 0 listings)
    // ------------------------

    // ------------------------
    // U4 (Ines → 7 listings)
    // ------------------------
    {
      title: 'دار للكراء في صفاقس',
      description: 'دار صغيرة في حي شعبي، قريبة من السوق الأسبوعي.',
      price: 500,
      state: 'Sfax',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 25 111 255',
      imageURL: '',
      ownerId: u4!.id,
    },
    {
      title: 'Appartement à louer à Manouba',
      description: 'Appartement S+2 au 3ème étage, bien ensoleillé.',
      price: 700,
      state: 'Manouba',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 25 111 255',
      imageURL: '',
      ownerId: u4!.id,
    },
    {
      title: 'Modern House in Nabeul',
      description: 'Newly built house, 3 bedrooms, 2 bathrooms.',
      price: 130000,
      state: 'Nabeul',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 25 111 255',
      imageURL: '',
      ownerId: u4!.id,
    },
    {
      title: 'Terrain à vendre à Kasserine',
      description:
        'Grand terrain constructible, proche de la route principale.',
      price: 60000,
      state: 'Kasserine',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 25 111 255',
      imageURL: '',
      ownerId: u4!.id,
    },
    {
      title: 'Small Studio in Ariana',
      description: 'S+0, furnished, internet included.',
      price: 400,
      state: 'Ariana',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 25 111 255',
      imageURL: '',
      ownerId: u4!.id,
    },
    {
      title: 'دار للبيع في توزر',
      description: 'دار تقليدية في وسط الواحة، تبريد طبيعي.',
      price: 70000,
      state: 'Tozeur',
      type: 'sale',
      availableAt: new Date(),
      contact: '+216 25 111 255',
      imageURL: '',
      ownerId: u4!.id,
    },
    {
      title: 'Appartement moderne à Bizerte',
      description: 'S+3 avec balcon, vue sur la mer.',
      price: 950,
      state: 'Bizerte',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 25 111 255',
      imageURL: '',
      ownerId: u4!.id,
    },

    // ------------------------
    // U5 (Khaled → 1 listing)
    // ------------------------
    {
      title: 'Small Office in Tunis Downtown',
      description: 'Perfect for startups. 40m², 2 rooms, 1 bathroom.',
      price: 1200,
      state: 'Tunis',
      type: 'rent',
      availableAt: new Date(),
      contact: '+216 26 111 266',
      imageURL: '',
      ownerId: u5!.id,
    },
  ];

  // Seed listings
  for (const l of listings) {
    await prisma.listing.create({ data: l });
  }
}

main()
  .then(() => console.log('✅ Database seeded with users & listings'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
