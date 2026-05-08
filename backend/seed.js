require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('./db')
const { User, Category, Product } = require('./models')

async function seed() {
  await connectDB()

  console.log('Clearing existing data...')
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ])

  console.log('Seeding categories...')
  const categories = await Category.insertMany([
    { name: 'Action Figures', slug: 'action-figures' },
    { name: 'Dolls',          slug: 'dolls' },
    { name: 'Board Games',    slug: 'board-games' },
    { name: 'Educational',    slug: 'educational' },
    { name: 'Outdoor',        slug: 'outdoor' },
  ])

  const bySlug = {}
  categories.forEach(c => bySlug[c.slug] = c._id)

  const API_URL = 'http://127.0.0.1:5001';
  
  console.log('Seeding products...')
  await Product.insertMany([
    // Action Figures
    { name: 'Galaxy Commander Action Figure', description: 'A highly detailed 12-inch action figure with 20 points of articulation, removable armor, and 3 accessories including a laser blaster and energy shield.', price: 24.99, category_id: bySlug['action-figures'], stock_qty: 35, age_min: 4,  age_max: 12, images: [`${API_URL}/uploads/galaxy_commander_toy_1778168658638.png`] },
    { name: 'Dragon Knight Warrior',           description: 'This 10-inch figure comes with a removable dragon helmet, glowing sword, and dragon companion. Made from durable child-safe plastic.',                     price: 19.99, category_id: bySlug['action-figures'], stock_qty: 52, age_min: 4,  age_max: 10, images: [`${API_URL}/uploads/dragon_knight_toy_v2_1778174442910.png`] },
    { name: 'Mega Robot Transformer',          description: 'Transforms from a sports car to a battle robot in 10 steps. Features LED eyes, battle sounds, and 15 points of articulation. Batteries included.',       price: 34.99, category_id: bySlug['action-figures'], stock_qty: 18, age_min: 6,  age_max: 14, images: [`${API_URL}/uploads/mega_robot_transformer_toy_v2_1778174495877.png`] },
    { name: 'Jungle Explorer Pack (4 Figures)',description: 'Set of 4 jungle explorer figures each with unique accessories including rope, map, binoculars, and machete.',                                             price: 29.99, category_id: bySlug['action-figures'], stock_qty: 0,  age_min: 3,  age_max: 8,  images: [`${API_URL}/uploads/jungle_explorer_toys_1778174373544.png`] },
    // Dolls
    { name: 'Princess Sofia Doll',             description: '18-inch doll with a beautiful ball gown, tiara, and matching shoes. Realistic blinking eyes and styleable hair. Clothes are removable.',                 price: 27.99, category_id: bySlug['dolls'],          stock_qty: 40, age_min: 3,  age_max: 10, images: [`${API_URL}/uploads/princess_doll_toy_1778168673558.png`] },
    { name: 'Baby Coo Doll',                   description: 'Realistic baby doll that coos, giggles, and cries. Soft body, weighted limbs, bottle, pacifier, and baby blanket included.',                            price: 39.99, category_id: bySlug['dolls'],          stock_qty: 25, age_min: 2,  age_max: 6,  images: [`${API_URL}/uploads/baby_doll_toy_1778174259819.png`] },
    { name: 'Fashion Doll Deluxe Set',         description: '12-inch doll with 5 complete outfits, a mini wardrobe, and 10 accessories. Mix and match for endless looks.',                                           price: 44.99, category_id: bySlug['dolls'],          stock_qty: 3,  age_min: 4,  age_max: 12, images: [`${API_URL}/uploads/fashion_doll_toy_deluxe_1778174275701.png`] },
    // Board Games
    { name: 'Treasure Hunt Family Game',       description: 'Exciting family board game for 2-6 players. Navigate the board, solve riddles, and find the hidden treasure. Average play time: 45 minutes.',           price: 22.99, category_id: bySlug['board-games'],    stock_qty: 60, age_min: 6,  age_max: 99, images: [`${API_URL}/uploads/treasure_hunt_board_game_1778168692775.png`] },
    { name: 'Word Wizards',                    description: 'The ultimate word game for the whole family. Create words from letter tiles on a colorful board. 3 difficulty levels. 2-8 players.',                    price: 18.99, category_id: bySlug['board-games'],    stock_qty: 45, age_min: 7,  age_max: 99, images: [`${API_URL}/uploads/word_wizards_game_1778174290566.png`] },
    { name: 'Strategy Castle',                 description: 'Build kingdoms, raise armies, and conquer territory. Modular board makes every game different. 2-4 players, 60-90 minutes.',                            price: 49.99, category_id: bySlug['board-games'],    stock_qty: 12, age_min: 10, age_max: 99, images: [`${API_URL}/uploads/strategy_castle_game_1778174318333.png`] },
    // Educational
    { name: 'Little Scientists Kit',           description: '20+ science experiments kids can do at home. Volcanoes, growing crystals, simple chemistry. Full color instruction booklet included.',                   price: 32.99, category_id: bySlug['educational'],    stock_qty: 28, age_min: 6,  age_max: 12, images: [`${API_URL}/uploads/science_kit_toy_1778168725117.png`] },
    { name: 'Math Adventure Puzzle Set',       description: '5 colorful wooden puzzles teaching numbers, addition, subtraction, and shapes. Self-correcting puzzles for independent learning.',                      price: 15.99, category_id: bySlug['educational'],    stock_qty: 70, age_min: 3,  age_max: 7,  images: [`${API_URL}/uploads/math_puzzle_toy_1778174387995.png`] },
    { name: 'Coding Robot Starter',            description: 'Introduce coding without a screen. Program this robot by pressing color-coded buttons. Teaches sequencing and logical thinking. No app required.',      price: 54.99, category_id: bySlug['educational'],    stock_qty: 4,  age_min: 4,  age_max: 8,  images: [`${API_URL}/uploads/coding_robot_toy_1778174333221.png`] },
    { name: 'World Map Floor Puzzle (100 pcs)',description: '3-foot giant floor puzzle of the world map. Kids learn continents, countries, and oceans while having fun. Great for group play.',                       price: 12.99, category_id: bySlug['educational'],    stock_qty: 90, age_min: 5,  age_max: 10, images: [`${API_URL}/uploads/world_map_floor_puzzle_1778174405574.png`] },
    // Outdoor
    { name: 'Super Splash Water Blaster',      description: 'Holds 1.5 liters, shoots up to 10 meters. Ergonomic grip, easy-fill nozzle. Available in 4 bright colors.',                                            price: 14.99, category_id: bySlug['outdoor'],       stock_qty: 100,age_min: 5,  age_max: 14, images: [`${API_URL}/uploads/water_blaster_toy_v2_1778174349299.png`] },
    { name: 'Pro Kick Scooter',                description: 'Aluminum scooter with adjustable handlebars (3 heights), ABEC-7 bearings, rear foot brake. Supports up to 50kg. Folds flat.',                          price: 69.99, category_id: bySlug['outdoor'],       stock_qty: 15, age_min: 6,  age_max: 14, images: [`${API_URL}/uploads/kick_scooter_toy_1778168743687.png`] },
    { name: 'Lawn Bowling Set',                description: 'Classic outdoor fun for the whole family. 8 colored balls and a jack. Solid resin balls in a carry bag.',                                               price: 26.99, category_id: bySlug['outdoor'],       stock_qty: 33, age_min: 5,  age_max: 99, images: [`${API_URL}/uploads/lawn_bowling_set_toy_1778174457567.png`] },
    { name: 'Jump Rope Set (3 Ropes)',         description: 'Set of 3 jump ropes — one individual and two long ropes for group skipping. Foam handles, smooth-turning bearings, adjustable length.',                 price: 9.99,  category_id: bySlug['outdoor'],       stock_qty: 2,  age_min: 4,  age_max: 12, images: [`${API_URL}/uploads/blue_jump_rope_1778197507574.png`] },
  ])

  console.log('Seeding admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await User.create({
    name:     'Admin',
    email:    'admin@toybox.com',
    password: hashedPassword,
    is_admin: true,
  })

  console.log('✅ Database seeded successfully!')
  console.log('Admin login → Email: admin@toybox.com | Password: admin123')
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
