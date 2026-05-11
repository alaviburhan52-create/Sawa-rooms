// ROOMS DATA with amenities
// Load or initialize rooms array
let rooms = JSON.parse(localStorage.getItem('sawaRooms')) || [
    { id: 1, name: "Cozy room Wandegeya", district: "Kampala", price: 7, rating: 4.2, image: "https://placehold.co/600x400/FFD1D1/black?text=Wandegeya", amenities: ["wifi","heater","parking"] },
    { id: 2, name: "Garden guesthouse", district: "Kampala", price: 10, rating: 4.5, image: "https://placehold.co/600x400/FFE0B3/black?text=Garden", amenities: ["wifi","breakfast","tv"] },
    { id: 3, name: "Jinja backpackers den", district: "Jinja", price: 5, rating: 4.0, image: "https://placehold.co/600x400/C8E6C9/black?text=Jinja", amenities: ["wifi","parking"] },
    { id: 4, name: "Mbarara city lodge", district: "Mbarara", price: 9, rating: 4.3, image: "https://placehold.co/600x400/FFCC80/black?text=Mbarara", amenities: ["heater","ac","tv"] },
    { id: 5, name: "Entebbe airport studio", district: "Entebbe", price: 12, rating: 4.7, image: "https://placehold.co/600x400/CE93D8/black?text=Entebbe", amenities: ["wifi","ac","parking","breakfast"] },
    { id: 6, name: "Kampala shared dorm", district: "Kampala", price: 6, rating: 3.8, image: "https://placehold.co/600x400/B3E5FC/black?text=Dorm", amenities: ["wifi","heater"] },
    { id: 7, name: "Jinja riverside cabin", district: "Jinja", price: 8, rating: 4.4, image: "https://placehold.co/600x400/A5D6A5/black?text=Riverside", amenities: ["wifi","parking","tv"] },
    { id: 8, name: "Mbarara quiet homestay", district: "Mbarara", price: 5, rating: 4.1, image: "https://placehold.co/600x400/FFAB91/black?text=Homestay", amenities: ["heater","breakfast"] },
    { id: 9, name: "Gulu traveller's inn", district: "Gulu", price: 11, rating: 4.0, image: "https://placehold.co/600x400/D7CCC8/black?text=Gulu", amenities: ["wifi","parking","ac"] }
];
 // ---------- HOST FORM LOGIC ----------
const showHostBtn = document.getElementById('showHostFormBtn');
const hostContainer = document.getElementById('hostFormContainer');
const cancelHost = document.getElementById('cancelHostForm');
const hostForm = document.getElementById('hostForm');

showHostBtn?.addEventListener('click', () => {
    hostContainer.style.display = 'block';
    showHostBtn.style.display = 'none';
});
cancelHost?.addEventListener('click', () => {
    hostContainer.style.display = 'none';
    showHostBtn.style.display = 'inline-block';
});

hostForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('roomName').value;
    const district = document.getElementById('roomDistrict').value;
    const price = parseFloat(document.getElementById('roomPrice').value);
    const rating = parseFloat(document.getElementById('roomRating').value);
    let image = document.getElementById('roomImage').value;
    if (!image) image = "https://placehold.co/600x400/FFD1D1/black?text=New+Room";
    
    // Gather selected amenities
    const selectedAmenities = [];
    document.querySelectorAll('#hostForm .amenities-list input:checked').forEach(cb => {
        selectedAmenities.push(cb.value);
    });
    
    const newId = rooms.length + 1;
    const newRoom = { id: newId, name, district, price, rating, image, amenities: selectedAmenities };
    rooms.push(newRoom);
    localStorage.setItem('sawaRooms', JSON.stringify(rooms));
    
    // Re-render and re-apply current filters
    filterRooms();  // will use updated rooms array
    hostContainer.style.display = 'none';
    showHostBtn.style.display = 'inline-block';
    hostForm.reset();
    document.getElementById('hostMessage').innerHTML = '✅ Room added! It appears in listings above.';
    setTimeout(() => { document.getElementById('hostMessage').innerHTML = ''; }, 3000);
});

let currentRooms = [...rooms];

function getSelectedAmenities() {
    let selected = [];
    document.querySelectorAll('.amenities-list input:checked').forEach(cb => {
        selected.push(cb.value);
    });
    return selected;
}

function filterRooms() {
    const priceVal = document.getElementById('priceFilter').value;
    const maxPrice = priceVal == 100 ? 999 : parseInt(priceVal);
    const district = document.getElementById('districtFilter').value;
    const minRating = parseFloat(document.getElementById('ratingFilter').value);
    const selectedAmenities = getSelectedAmenities();

    let filtered = rooms.filter(room => {
        if (room.price > maxPrice) return false;
        if (district !== 'all' && room.district !== district) return false;
        if (minRating > 0 && room.rating < minRating) return false;
        // amenities: room must contain ALL selected amenities
        for (let amen of selectedAmenities) {
            if (!room.amenities.includes(amen)) return false;
        }
        return true;
    });
    currentRooms = filtered;
    renderRooms(currentRooms);
    document.getElementById('resultCount').innerText = `${currentRooms.length} stays found`;
}

function renderRooms(roomsArray) {
    const container = document.getElementById('roomsContainer');
    if (!container) return;
    if (roomsArray.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No rooms match your filters 🌟 Try adjusting amenities or price.</p>';
        return;
    }
    container.innerHTML = roomsArray.map(room => `
        <div class="room-card" data-id="${room.id}">
            <div class="room-img" style="background-image: url('${room.image}');"></div>
            <div class="room-info">
                <div class="room-title">${room.name}</div>
                <div class="room-location">📍 ${room.district} | ⭐ ${room.rating}</div>
                <div class="room-amenities">
                    ${room.amenities.map(a => `<span class="amenity-badge">${a}</span>`).join('')}
                </div>
                <div class="room-price">$${room.price} <small>/ night</small></div>
                <button class="book-btn" data-room='${JSON.stringify(room)}'>Book now</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomData = JSON.parse(btn.getAttribute('data-room'));
            openBookingModal(roomData);
        });
    });
}

// Modal logic
const modal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close-modal');
let selectedRoom = null;

function openBookingModal(room) {
    selectedRoom = room;
    document.getElementById('modalRoomName').value = room.name;
    modal.style.display = 'flex';
    document.getElementById('totalPriceDisplay').innerText = '';
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    document.getElementById('bookingForm').reset();
    document.getElementById('modalMessage').innerHTML = '';
};

window.onclick = (e) => { if (e.target === modal) closeModal.click(); };

document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guestName').value;
    const email = document.getElementById('guestEmail').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    if (!name || !email || !checkin || !checkout) {
        document.getElementById('modalMessage').innerHTML = '⚠️ Please fill all fields.';
        return;
    }
    if (new Date(checkin) >= new Date(checkout)) {
        document.getElementById('modalMessage').innerHTML = '⚠️ Check-out must be after check-in.';
        return;
    }
    // nights calculation
    const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000*3600*24));
    const total = nights * selectedRoom.price;
    document.getElementById('totalPriceDisplay').innerHTML = `Total: $${total} (${nights} nights)`;
    
    const booking = { room: selectedRoom.name, guest: name, email, checkin, checkout, total, date: new Date() };
    let bookings = JSON.parse(localStorage.getItem('sawaBookings')) || [];
    bookings.push(booking);
    localStorage.setItem('sawaBookings', JSON.stringify(bookings));
    
    document.getElementById('modalMessage').innerHTML = `✅ Booked ${selectedRoom.name} for ${name}! Total $${total}. (demo)`;
    setTimeout(() => { modal.style.display = 'none'; }, 2500);
});

// Search by location text
document.getElementById('searchBtn').addEventListener('click', () => {
    const locText = document.getElementById('locationSearch').value.toLowerCase();
    if (locText === "") {
        filterRooms(); 
        return;
    }
    let filteredByLoc = rooms.filter(r => r.district.toLowerCase().includes(locText) || r.name.toLowerCase().includes(locText));
    // then apply other filters
    const priceVal = document.getElementById('priceFilter').value;
    const maxPrice = priceVal == 100 ? 999 : parseInt(priceVal);
    const district = document.getElementById('districtFilter').value;
    const minRating = parseFloat(document.getElementById('ratingFilter').value);
    const selectedAmenities = getSelectedAmenities();
    let final = filteredByLoc.filter(room => {
        if (room.price > maxPrice) return false;
        if (district !== 'all' && room.district !== district) return false;
        if (minRating > 0 && room.rating < minRating) return false;
        for (let a of selectedAmenities) if (!room.amenities.includes(a)) return false;
        return true;
    });
    currentRooms = final;
    renderRooms(currentRooms);
    document.getElementById('resultCount').innerText = `${currentRooms.length} stays found`;
});

document.getElementById('applyFilters').addEventListener('click', filterRooms);

// initial render
filterRooms();  