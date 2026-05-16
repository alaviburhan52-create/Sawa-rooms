// UGX conversion (1 USD ≈ 3700 UGX) – rounding to nearest 5000
function toUgx(usd) {
    let ugx = usd * 3700;
    ugx = Math.round(ugx / 5000) * 5000;
    return ugx.toLocaleString('en-UG');
}

// Large pool of working Unsplash images (keep your favourites)
const imagePool = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1586023492121-27a2e3536ea2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
];

// Unique room names per city (7 each)
const roomNamesByCity = {
  Kampala: [
    "Modern Loft in Kololo", "Cozy Studio near Acacia Mall", "Entire Apartment in Naguru",
    "Sunny Room in Ntinda", "Luxury Villa in Muyenga", "Executive Suite in Nakasero",
    "Penthouse with City View"
  ],
  Jinja: [
    "Riverside Cabin on the Nile", "Backpackers Den near Source", "Entire House near Bujagali",
    "Cozy Private Room with Garden", "Luxury Lodge with Pool", "Budget Double near Market",
    "Lakefront Studio with Sunset View"
  ],
  Mbarara: [
    "City Lodge in Mbarara", "Quiet Homestay near Campus", "Apartment with Mountain View",
    "Budget Shared Room", "Guesthouse near Hospital", "Luxury Suite with Jacuzzi",
    "Family House with Garden"
  ],
  Entebbe: [
    "Airport Studio 5min Drive", "Lake Victoria View Room", "Budget Double near Beach",
    "Entire Cottage with Terrace", "Backpacker Dorm near Airport", "Guesthouse near Botanical Gardens",
    "Family Suite with Kitchen"
  ],
  Gulu: [
    "Traveler's Inn Downtown", "Budget Dorm in Gulu Town", "Entire House near Market",
    "Quiet Guesthouse with Courtyard", "Luxury Suite with AC", "Studio Apartment with Workspace",
    "Family Homestay with Meals"
  ],
  "Fort Portal": [
    "Crater Lake View Lodge", "Budget Backpackers near Town", "Cottage near Kibale Forest",
    "Homestay with Garden", "Luxury Resort with Spa", "Guesthouse in Town Center",
    "Studio near Market Square"
  ],
  Arua: [
    "Garden Studio with Breakfast", "Budget Room with Fan", "Entire House with Parking",
    "Guesthouse near Arua Market", "Luxury Villa with Pool", "Simple Double Room",
    "Family Room with Kitchenette"
  ]
};

const hosts = ['Sarah', 'James', 'Grace', 'John', 'Martha', 'Peter', 'Alice', 'David', 'Linda', 'Brian', 'Catherine', 'Joseph', 'Sophia', 'Daniel', 'Olivia'];
const roomTypes = ['Entire place', 'Private room', 'Shared dorm'];
const amenitiesList = ['wifi', 'heater', 'parking', 'breakfast', 'ac', 'tv'];

function generateUniqueRooms() {
    let rooms = [];
    let id = 1;
    const cities = Object.keys(roomNamesByCity);
    for (let city of cities) {
        const names = roomNamesByCity[city];
        let shuffledImages = [...imagePool];
        for (let i = shuffledImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
        }
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const usdPrice = Math.floor(Math.random() * 50) + 5;
            const priceUgx = toUgx(usdPrice);
            const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
            const reviews = Math.floor(Math.random() * 200) + 5;
            const host = hosts[Math.floor(Math.random() * hosts.length)];
            const image = shuffledImages[i % shuffledImages.length];
            const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
            const distance = (Math.random() * 3 + 0.2).toFixed(1) + 'km';
            const amenities = [];
            const numAmenities = Math.floor(Math.random() * 4) + 1;
            for (let a = 0; a < numAmenities; a++) {
                const amen = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];
                if (!amenities.includes(amen)) amenities.push(amen);
            }
            rooms.push({ id: id++, name, district: city, price: usdPrice, priceUgx, rating: Number(rating), reviews, host, image, amenities, distance, type });
        }
    }
    return rooms;
}

let allRooms = generateUniqueRooms();
if (!localStorage.getItem('sawaRooms')) {
    localStorage.setItem('sawaRooms', JSON.stringify(allRooms));
} else {
    allRooms = JSON.parse(localStorage.getItem('sawaRooms'));
}

let wishlist = JSON.parse(localStorage.getItem('sawaWishlist')) || [];

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '★';
    if (half) stars += '½';
    for (let i = stars.length; i < 5; i++) stars += '☆';
    return stars;
}

window.renderStars = renderStars;
window.allRooms = allRooms;
window.wishlist = wishlist;
window.toUgx = toUgx;