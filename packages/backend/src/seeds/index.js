const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { createTables } = require('../database/migrate');

const seedData = async () => {
  try {
    console.log('Creating tables...');
    await createTables();

    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT INTO users (email, password, name, role, zone, points) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
      ['admin@ecogestion.local', hashedPassword, 'Admin User', 'admin', 'Centro', 0]
    );

    const userPassword = await bcrypt.hash('user123', 10);
    await db.query(
      'INSERT INTO users (email, password, name, role, zone, points) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
      ['user@ecogestion.local', userPassword, 'Demo User', 'user', 'Norte', 50]
    );

    console.log('Seeding materials...');
    const materials = [
      ['Botellas de Plástico PET', 'plastico', 'Botellas de bebidas transparentes', 'Enjuagar antes de desechar. Aplastar para ahorrar espacio.', null, true],
      ['Vidrio', 'vidrio', 'Botellas y frascos de vidrio', 'Enjuagar y remover tapas. No incluir vidrio roto.', null, true],
      ['Papel y Cartón', 'papel', 'Periódicos, revistas, cajas de cartón', 'Mantener seco y limpio. Aplanar cajas.', null, true],
      ['Residuos Orgánicos', 'organico', 'Restos de frutas, verduras, cáscaras', 'Separar de otros residuos. Ideal para compostaje.', null, true],
      ['Baterías', 'electronicos', 'Pilas y baterías recargables', 'No tirar con basura común. Llevar a puntos especiales.', null, true],
      ['Aparatos Electrónicos', 'electronicos', 'Celulares, computadoras, electrodomésticos pequeños', 'Borrar datos personales antes de desechar.', null, true],
      ['Latas de Aluminio', 'metal', 'Latas de bebidas y conservas', 'Enjuagar antes de reciclar.', null, true],
      ['Bolsas Plásticas', 'plastico', 'Bolsas de compras y empaque', 'Reutilizar cuando sea posible.', null, true],
    ];

    for (const material of materials) {
      await db.query(
        'INSERT INTO materials (name, category, description, disposal_instructions, image_url, is_approved) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
        material
      );
    }

    console.log('Seeding recycling centers...');
    const centers = [
      ['La Recuperadora Guárico 2016 C.A.', 'Zona Industrial Guárico, Venezuela', 8.7489, -67.9243, '+58-247-1234567', 'info@recuperadora.com', '{plastico,vidrio,papel,metal}', 'Lunes a Viernes: 8:00-17:00, Sábados: 8:00-12:00', true],
      ['Centro de Reciclaje Norte', 'Av. Principal Norte, Sector 2', 8.7650, -67.9100, '+58-247-7654321', 'contacto@reciclajnorte.com', '{plastico,papel,organico}', 'Lunes a Sábado: 7:00-16:00', true],
      ['Punto Verde Sur', 'Calle 5, Urbanización Sur', 8.7300, -67.9400, '+58-247-9876543', 'puntoverdesur@mail.com', '{vidrio,metal,electronicos}', 'Martes a Domingo: 9:00-18:00', true],
    ];

    for (const center of centers) {
      await db.query(
        'INSERT INTO recycling_centers (name, address, latitude, longitude, phone, email, accepted_materials, schedule, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
        center
      );
    }

    console.log('Seeding collection schedules...');
    const schedules = [
      ['Norte', 'plastico', 1, '08:00', 'Recolección de plásticos los lunes'],
      ['Norte', 'organico', 3, '07:00', 'Recolección de orgánicos los miércoles'],
      ['Norte', 'papel', 5, '09:00', 'Recolección de papel los viernes'],
      ['Centro', 'plastico', 2, '08:00', 'Recolección de plásticos los martes'],
      ['Centro', 'vidrio', 4, '10:00', 'Recolección de vidrio los jueves'],
      ['Sur', 'organico', 2, '07:00', 'Recolección de orgánicos los martes'],
      ['Sur', 'papel', 4, '08:00', 'Recolección de papel los jueves'],
      ['Este', 'plastico', 3, '09:00', 'Recolección de plásticos los miércoles'],
      ['Oeste', 'vidrio', 1, '10:00', 'Recolección de vidrio los lunes'],
    ];

    for (const schedule of schedules) {
      await db.query(
        'INSERT INTO collection_schedules (zone, material_type, day_of_week, time, description) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        schedule
      );
    }

    console.log('Seeding challenges...');
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const challenges = [
      ['Semana del Reciclaje', 'Recicla al menos 5 items diferentes esta semana', 50, today.toISOString().split('T')[0], nextWeek.toISOString().split('T')[0], 'easy', true],
      ['Maestro del Compostaje', 'Crea tu propio compost con residuos orgánicos', 100, today.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0], 'medium', true],
      ['Cero Plástico', 'Pasa una semana sin usar plásticos de un solo uso', 150, today.toISOString().split('T')[0], nextWeek.toISOString().split('T')[0], 'hard', true],
      ['Educador Ambiental', 'Enseña a 3 personas sobre reciclaje correcto', 75, today.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0], 'medium', true],
    ];

    for (const challenge of challenges) {
      await db.query(
        'INSERT INTO challenges (title, description, points, start_date, end_date, difficulty, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
        challenge
      );
    }

    console.log('Seeding badges...');
    const badges = [
      ['Principiante Verde', 'Completaste tu primer reto de reciclaje', null, 0],
      ['Reciclador Activo', 'Acumulaste 100 puntos', null, 100],
      ['Eco Guerrero', 'Acumulaste 500 puntos', null, 500],
      ['Maestro del Reciclaje', 'Acumulaste 1000 puntos', null, 1000],
      ['Campeón Ambiental', 'Completaste 10 retos', null, 0],
    ];

    for (const badge of badges) {
      await db.query(
        'INSERT INTO badges (name, description, icon_url, requirement_points) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        badge
      );
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
