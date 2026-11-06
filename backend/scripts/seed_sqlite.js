const { sequelize, User, Material, Center, Schedule, Challenge, Badge, UserChallenge, UserBadge } = require('../src/models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const seedPassword = process.env.SEED_PASSWORD;
    if (!seedPassword || seedPassword.length < 12) {
      throw new Error('SEED_PASSWORD must be set and contain at least 12 characters');
    }

    console.log('🌱 Starting database seeding (SQLite)...');
    
    // Sync database (force: true drops tables)
    await sequelize.sync({ force: true });
    console.log('📦 Database synced (all tables dropped and recreated)');

    // 1. Seed Users
    console.log('📝 Seeding users...');
    const hashedPassword = await bcrypt.hash(seedPassword, 10);
    
    await User.bulkCreate([
      { email: 'admin@example.invalid', password: hashedPassword, name: 'Administrador', role: 'admin', zone: 'Centro', points: 500 },
      { email: 'usuario1@example.invalid', password: hashedPassword, name: 'Usuario Norte', role: 'user', zone: 'Norte', points: 150 },
      { email: 'usuario2@example.invalid', password: hashedPassword, name: 'Usuario Sur', role: 'user', zone: 'Sur', points: 200 },
      { email: 'usuario3@example.invalid', password: hashedPassword, name: 'Usuario Este', role: 'user', zone: 'Este', points: 80 }
    ]);
    
    // 2. Seed Materials
    console.log('♻️  Seeding materials...');
    await Material.bulkCreate([
      { name: 'Botella de Plástico PET', category: 'plastico', description: 'Botellas de bebidas hechas de tereftalato de polietileno', disposal_instructions: 'Enjuagar antes de depositar. Quitar etiquetas si es posible. Aplastar para ahorrar espacio.', recyclable: true, image_url: '/images/materials/plastic-bottle.png' },
      { name: 'Envases de Vidrio', category: 'vidrio', description: 'Botellas y frascos de vidrio transparente o de color', disposal_instructions: 'Enjuagar y quitar tapas. No incluir cristales rotos de ventanas o espejos.', recyclable: true, image_url: '/images/materials/glass-bottle.png' },
      { name: 'Papel y Cartón', category: 'papel', description: 'Periódicos, revistas, cajas de cartón', disposal_instructions: 'Mantener secos. Aplanar cajas. No incluir papel sucio o con grasa.', recyclable: true, image_url: '/images/materials/paper-cardboard.png' },
      { name: 'Residuos Orgánicos', category: 'organico', description: 'Restos de frutas, verduras y alimentos no procesados', disposal_instructions: 'Separar de otros residuos. Ideal para compostaje casero.', recyclable: true, image_url: '/images/materials/organic.png' },
      { name: 'Pilas y Baterías', category: 'electronico', description: 'Pilas alcalinas, baterías recargables', disposal_instructions: 'Nunca tirar con basura común. Llevar a puntos de recolección especializados.', recyclable: true, image_url: '/images/materials/batteries.png' },
      { name: 'Dispositivos Electrónicos', category: 'electronico', description: 'Teléfonos móviles, computadoras, electrodomésticos', disposal_instructions: 'Eliminar datos personales antes de reciclar. Buscar centros especializados en RAEE.', recyclable: true, image_url: '/images/materials/electronics.png' },
      { name: 'Bolsas Plásticas', category: 'plastico', description: 'Bolsas de supermercado y envases flexibles', disposal_instructions: 'Reutilizar cuando sea posible. Algunos supermercados tienen puntos de recolección.', recyclable: true, image_url: '/images/materials/plastic-bags.png' },
      { name: 'Latas de Aluminio', category: 'plastico', description: 'Latas de bebidas y conservas', disposal_instructions: 'Enjuagar. Se pueden aplastar. Altamente reciclables.', recyclable: true, image_url: '/images/materials/aluminum-cans.png' },
      { name: 'Tetra Pak', category: 'papel', description: 'Envases de cartón para leche y jugos', disposal_instructions: 'Enjuagar y aplanar. Algunos centros los aceptan con papel.', recyclable: true, image_url: '/images/materials/tetra-pak.png' },
      { name: 'Aceite de Cocina Usado', category: 'organico', description: 'Aceite vegetal usado en la cocina', disposal_instructions: 'Nunca tirar por el desagüe. Guardar en botella y llevar a punto de recolección.', recyclable: true, image_url: '/images/materials/cooking-oil.png' }
    ]);

    // 3. Seed Centers
    console.log('📍 Seeding recycling centers...');
    await Center.bulkCreate([
      { name: 'La Recuperadora Guárico 2016 C.A.', address: 'Av. Principal, Calabozo, Estado Guárico', latitude: 8.9247, longitude: -67.4297, phone: '+58-246-8710000', email: 'contacto@recuperadora.com', accepted_materials: ['plastico', 'vidrio', 'papel', 'electronico'], hours_operation: 'Lun-Vie: 8:00-17:00, Sáb: 8:00-12:00', status: 'active' },
      { name: 'Centro de Acopio Norte', address: 'Zona Industrial Norte, Calabozo', latitude: 8.9350, longitude: -67.4200, phone: '+58-246-8710001', email: 'norte@ecocentro.com', accepted_materials: ['plastico', 'vidrio', 'papel'], hours_operation: 'Lun-Sáb: 7:00-16:00', status: 'active' },
      { name: 'EcoRecicla Sur', address: 'Sector Sur, Calabozo', latitude: 8.9100, longitude: -67.4350, phone: '+58-246-8710002', email: 'sur@ecorecicla.com', accepted_materials: ['organico', 'papel', 'plastico'], hours_operation: 'Lun-Vie: 8:00-18:00', status: 'active' },
      { name: 'Punto Verde Este', address: 'Zona Este, Calabozo', latitude: 8.9280, longitude: -67.4150, phone: '+58-246-8710003', email: 'este@puntoverde.com', accepted_materials: ['electronico', 'plastico'], hours_operation: 'Mar-Dom: 9:00-17:00', status: 'active' },
      { name: 'Centro de Compostaje Municipal', address: 'Área Metropolitana, Calabozo', latitude: 8.9200, longitude: -67.4280, phone: '+58-246-8710004', email: 'compost@municipio.gob.ve', accepted_materials: ['organico'], hours_operation: 'Lun-Vie: 7:00-15:00', status: 'active' }
    ]);

    // 4. Seed Schedules
    console.log('📅 Seeding schedules...');
    await Schedule.bulkCreate([
      { zone: 'Centro', material_category: 'organico', day_of_week: 1, time: '07:00', description: 'Recolección de residuos orgánicos', active: true },
      { zone: 'Centro', material_category: 'plastico', day_of_week: 3, time: '08:00', description: 'Recolección de plásticos', active: true },
      { zone: 'Centro', material_category: 'papel', day_of_week: 5, time: '08:00', description: 'Recolección de papel y cartón', active: true },
      { zone: 'Norte', material_category: 'organico', day_of_week: 2, time: '07:00', description: 'Recolección de residuos orgánicos', active: true },
      { zone: 'Norte', material_category: 'plastico', day_of_week: 4, time: '08:00', description: 'Recolección de plásticos y vidrio', active: true },
      { zone: 'Norte', material_category: 'vidrio', day_of_week: 4, time: '08:00', description: 'Recolección de plásticos y vidrio', active: true },
      { zone: 'Sur', material_category: 'organico', day_of_week: 1, time: '06:30', description: 'Recolección de residuos orgánicos', active: true },
      { zone: 'Sur', material_category: 'papel', day_of_week: 3, time: '07:30', description: 'Recolección de papel', active: true },
      { zone: 'Sur', material_category: 'plastico', day_of_week: 5, time: '07:30', description: 'Recolección de plásticos', active: true },
      { zone: 'Este', material_category: 'organico', day_of_week: 2, time: '07:00', description: 'Recolección de residuos orgánicos', active: true },
      { zone: 'Este', material_category: 'plastico', day_of_week: 4, time: '08:00', description: 'Recolección de reciclables', active: true },
      { zone: 'Este', material_category: 'vidrio', day_of_week: 4, time: '08:00', description: 'Recolección de reciclables', active: true }
    ]);

    // 5. Seed Challenges
    console.log('🎯 Seeding challenges...');
    const now = new Date();
    const sevenDaysLater = new Date(now); sevenDaysLater.setDate(now.getDate() + 7);
    const thirtyDaysLater = new Date(now); thirtyDaysLater.setDate(now.getDate() + 30);

    await Challenge.bulkCreate([
      { title: 'Recicla 5 Botellas Plásticas', description: 'Recicla al menos 5 botellas de plástico esta semana', points_reward: 20, challenge_type: 'weekly', start_date: now, end_date: sevenDaysLater, status: 'active', target_value: 5, icon: 'bottle' },
      { title: 'Compostaje Diario', description: 'Separa tus residuos orgánicos durante 7 días consecutivos', points_reward: 30, challenge_type: 'weekly', start_date: now, end_date: sevenDaysLater, status: 'active', target_value: 7, icon: 'compost' },
      { title: 'Visita un Centro de Reciclaje', description: 'Visita uno de nuestros centros de reciclaje y recicla tus materiales', points_reward: 25, challenge_type: 'weekly', start_date: now, end_date: sevenDaysLater, status: 'active', target_value: 1, icon: 'location' },
      { title: 'Experto en Separación', description: 'Clasifica correctamente 10 tipos diferentes de residuos', points_reward: 15, challenge_type: 'weekly', start_date: now, end_date: sevenDaysLater, status: 'active', target_value: 10, icon: 'sort' },
      { title: 'Mes del Reciclaje', description: 'Participa en actividades de reciclaje durante todo el mes', points_reward: 100, challenge_type: 'monthly', start_date: now, end_date: thirtyDaysLater, status: 'active', target_value: 20, icon: 'trophy' },
      { title: 'Reduce el Plástico', description: 'Evita usar 10 productos plásticos de un solo uso', points_reward: 40, challenge_type: 'weekly', start_date: now, end_date: sevenDaysLater, status: 'active', target_value: 10, icon: 'leaf' }
    ]);

    // 6. Seed Badges
    console.log('🏆 Seeding badges...');
    await Badge.bulkCreate([
      { name: 'Principiante Eco', description: 'Has comenzado tu viaje ecológico', icon: 'eco-start', requirement_type: 'points', requirement_value: 50 },
      { name: 'Reciclador Intermedio', description: 'Llevas buen camino en el reciclaje', icon: 'recycle-medium', requirement_type: 'points', requirement_value: 200 },
      { name: 'Maestro del Reciclaje', description: 'Eres un experto en reciclaje', icon: 'recycle-master', requirement_type: 'points', requirement_value: 500 },
      { name: 'Completador de Retos', description: 'Has completado 5 retos', icon: 'challenge-complete', requirement_type: 'challenges_completed', requirement_value: 5 },
      { name: 'Héroe Verde', description: 'Has completado 10 retos', icon: 'green-hero', requirement_type: 'challenges_completed', requirement_value: 10 },
      { name: 'Guerrero Ambiental', description: 'Has acumulado 1000 puntos', icon: 'eco-warrior', requirement_type: 'points', requirement_value: 1000 },
      { name: 'Semana Verde', description: 'Has estado activo durante 7 días consecutivos', icon: 'week-streak', requirement_type: 'days_active', requirement_value: 7 },
      { name: 'Mes Ecológico', description: 'Has estado activo durante 30 días consecutivos', icon: 'month-streak', requirement_type: 'days_active', requirement_value: 30 }
    ]);

    console.log('✅ SQLite seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
