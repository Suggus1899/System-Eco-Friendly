const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data (in reverse order of dependencies)
    await client.query('TRUNCATE user_badges, user_challenges, badges, challenges, schedules, centers, materials, users RESTART IDENTITY CASCADE');
    
    // 1. Seed Users
    console.log('📝 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await client.query(`
      INSERT INTO users (email, password, name, role, zone, points) VALUES
      ('admin@ecogestion.com', $1, 'Administrador', 'admin', 'Centro', 500),
      ('usuario1@example.com', $1, 'María González', 'user', 'Norte', 150),
      ('usuario2@example.com', $1, 'Juan Pérez', 'user', 'Sur', 200),
      ('usuario3@example.com', $1, 'Ana Rodríguez', 'user', 'Este', 80)
    `, [hashedPassword]);
    
    // 2. Seed Materials
    console.log('♻️  Seeding materials...');
    await client.query(`
      INSERT INTO materials (name, category, description, disposal_instructions, recyclable, image_url) VALUES
      ('Botella de Plástico PET', 'plastico', 'Botellas de bebidas hechas de tereftalato de polietileno', 'Enjuagar antes de depositar. Quitar etiquetas si es posible. Aplastar para ahorrar espacio.', true, '/images/materials/plastic-bottle.png'),
      ('Envases de Vidrio', 'vidrio', 'Botellas y frascos de vidrio transparente o de color', 'Enjuagar y quitar tapas. No incluir cristales rotos de ventanas o espejos.', true, '/images/materials/glass-bottle.png'),
      ('Papel y Cartón', 'papel', 'Periódicos, revistas, cajas de cartón', 'Mantener secos. Aplanar cajas. No incluir papel sucio o con grasa.', true, '/images/materials/paper-cardboard.png'),
      ('Residuos Orgánicos', 'organico', 'Restos de frutas, verduras y alimentos no procesados', 'Separar de otros residuos. Ideal para compostaje casero.', true, '/images/materials/organic.png'),
      ('Pilas y Baterías', 'electronico', 'Pilas alcalinas, baterías recargables', 'Nunca tirar con basura común. Llevar a puntos de recolección especializados.', true, '/images/materials/batteries.png'),
      ('Dispositivos Electrónicos', 'electronico', 'Teléfonos móviles, computadoras, electrodomésticos', 'Eliminar datos personales antes de reciclar. Buscar centros especializados en RAEE.', true, '/images/materials/electronics.png'),
      ('Bolsas Plásticas', 'plastico', 'Bolsas de supermercado y envases flexibles', 'Reutilizar cuando sea posible. Algunos supermercados tienen puntos de recolección.', true, '/images/materials/plastic-bags.png'),
      ('Latas de Aluminio', 'plastico', 'Latas de bebidas y conservas', 'Enjuagar. Se pueden aplastar. Altamente reciclables.', true, '/images/materials/aluminum-cans.png'),
      ('Tetra Pak', 'papel', 'Envases de cartón para leche y jugos', 'Enjuagar y aplanar. Algunos centros los aceptan con papel.', true, '/images/materials/tetra-pak.png'),
      ('Aceite de Cocina Usado', 'organico', 'Aceite vegetal usado en la cocina', 'Nunca tirar por el desagüe. Guardar en botella y llevar a punto de recolección.', true, '/images/materials/cooking-oil.png')
    `);
    
    // 3. Seed Centers
    console.log('📍 Seeding recycling centers...');
    await client.query(`
      INSERT INTO centers (name, address, latitude, longitude, phone, email, accepted_materials, hours_operation, status) VALUES
      ('La Recuperadora Guárico 2016 C.A.', 'Av. Principal, Calabozo, Estado Guárico', 8.9247, -67.4297, '+58-246-8710000', 'contacto@recuperadora.com', ARRAY['plastico', 'vidrio', 'papel', 'electronico'], 'Lun-Vie: 8:00-17:00, Sáb: 8:00-12:00', 'active'),
      ('Centro de Acopio Norte', 'Zona Industrial Norte, Calabozo', 8.9350, -67.4200, '+58-246-8710001', 'norte@ecocentro.com', ARRAY['plastico', 'vidrio', 'papel'], 'Lun-Sáb: 7:00-16:00', 'active'),
      ('EcoRecicla Sur', 'Sector Sur, Calabozo', 8.9100, -67.4350, '+58-246-8710002', 'sur@ecorecicla.com', ARRAY['organico', 'papel', 'plastico'], 'Lun-Vie: 8:00-18:00', 'active'),
      ('Punto Verde Este', 'Zona Este, Calabozo', 8.9280, -67.4150, '+58-246-8710003', 'este@puntoverde.com', ARRAY['electronico', 'plastico'], 'Mar-Dom: 9:00-17:00', 'active'),
      ('Centro de Compostaje Municipal', 'Área Metropolitana, Calabozo', 8.9200, -67.4280, '+58-246-8710004', 'compost@municipio.gob.ve', ARRAY['organico'], 'Lun-Vie: 7:00-15:00', 'active')
    `);
    
    // 4. Seed Schedules
    console.log('📅 Seeding schedules...');
    await client.query(`
      INSERT INTO schedules (zone, material_category, day_of_week, time, description, active) VALUES
      ('Centro', 'organico', 1, '07:00', 'Recolección de residuos orgánicos', true),
      ('Centro', 'plastico', 3, '08:00', 'Recolección de plásticos', true),
      ('Centro', 'papel', 5, '08:00', 'Recolección de papel y cartón', true),
      ('Norte', 'organico', 2, '07:00', 'Recolección de residuos orgánicos', true),
      ('Norte', 'plastico', 4, '08:00', 'Recolección de plásticos y vidrio', true),
      ('Norte', 'vidrio', 4, '08:00', 'Recolección de plásticos y vidrio', true),
      ('Sur', 'organico', 1, '06:30', 'Recolección de residuos orgánicos', true),
      ('Sur', 'papel', 3, '07:30', 'Recolección de papel', true),
      ('Sur', 'plastico', 5, '07:30', 'Recolección de plásticos', true),
      ('Este', 'organico', 2, '07:00', 'Recolección de residuos orgánicos', true),
      ('Este', 'plastico', 4, '08:00', 'Recolección de reciclables', true),
      ('Este', 'vidrio', 4, '08:00', 'Recolección de reciclables', true)
    `);
    
    // 5. Seed Challenges
    console.log('🎯 Seeding challenges...');
    await client.query(`
      INSERT INTO challenges (title, description, points_reward, challenge_type, start_date, end_date, status, target_value, icon) VALUES
      ('Recicla 5 Botellas Plásticas', 'Recicla al menos 5 botellas de plástico esta semana', 20, 'weekly', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'active', 5, 'bottle'),
      ('Compostaje Diario', 'Separa tus residuos orgánicos durante 7 días consecutivos', 30, 'weekly', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'active', 7, 'compost'),
      ('Visita un Centro de Reciclaje', 'Visita uno de nuestros centros de reciclaje y recicla tus materiales', 25, 'weekly', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'active', 1, 'location'),
      ('Experto en Separación', 'Clasifica correctamente 10 tipos diferentes de residuos', 15, 'weekly', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'active', 10, 'sort'),
      ('Mes del Reciclaje', 'Participa en actividades de reciclaje durante todo el mes', 100, 'monthly', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active', 20, 'trophy'),
      ('Reduce el Plástico', 'Evita usar 10 productos plásticos de un solo uso', 40, 'weekly', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'active', 10, 'leaf')
    `);
    
    // 6. Seed Badges
    console.log('🏆 Seeding badges...');
    await client.query(`
      INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
      ('Principiante Eco', 'Has comenzado tu viaje ecológico', 'eco-start', 'points', 50),
      ('Reciclador Intermedio', 'Llevas buen camino en el reciclaje', 'recycle-medium', 'points', 200),
      ('Maestro del Reciclaje', 'Eres un experto en reciclaje', 'recycle-master', 'points', 500),
      ('Completador de Retos', 'Has completado 5 retos', 'challenge-complete', 'challenges_completed', 5),
      ('Héroe Verde', 'Has completado 10 retos', 'green-hero', 'challenges_completed', 10),
      ('Guerrero Ambiental', 'Has acumulado 1000 puntos', 'eco-warrior', 'points', 1000),
      ('Semana Verde', 'Has estado activo durante 7 días consecutivos', 'week-streak', 'days_active', 7),
      ('Mes Ecológico', 'Has estado activo durante 30 días consecutivos', 'month-streak', 'days_active', 30)
    `);
    
    // 7. Seed User Challenges (some progress)
    console.log('📊 Seeding user challenge progress...');
    await client.query(`
      INSERT INTO user_challenges (user_id, challenge_id, progress, completed) VALUES
      (2, 1, 3, false),
      (2, 2, 5, false),
      (3, 1, 5, true),
      (3, 3, 1, true),
      (4, 2, 2, false)
    `);
    
    // 8. Seed User Badges
    console.log('🎖️  Seeding user badges...');
    await client.query(`
      INSERT INTO user_badges (user_id, badge_id) VALUES
      (2, 1),
      (3, 1),
      (3, 2),
      (4, 1)
    `);

    await client.query('COMMIT');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('   - 4 users created (1 admin, 3 regular users)');
    console.log('   - 10 materials added');
    console.log('   - 5 recycling centers added');
    console.log('   - 12 collection schedules created');
    console.log('   - 6 challenges created');
    console.log('   - 8 badges created');
    console.log('');
    console.log('🔑 Test credentials:');
    console.log('   Admin: admin@ecogestion.com / password123');
    console.log('   User:  usuario1@example.com / password123');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
