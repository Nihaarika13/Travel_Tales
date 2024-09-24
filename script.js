// script.js

document.getElementById('plannerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevents the default form submission

    // Get form values
    const place = document.getElementById('place').value;
    const days = parseInt(document.getElementById('days').value, 10);
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const passengers = document.getElementById('passengers').value;
    const radius = document.getElementById('radius').value;
    const budget = document.getElementById('budget').value;
    const contactNo = document.getElementById('contactNo').value;
    const email = document.getElementById('email').value;

    // Validate input
    if (!place || !days || !startDate || !passengers || !radius || !budget || !contactNo || !email) {
        alert('Please fill out all fields.');
        return;
    }

    // Calculate end date if not provided
    if (!endDate.getTime()) {
        endDate.setDate(startDate.getDate() + days - 1);
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    }

    // Generate itinerary
    let itineraryHtml = `<h2>Travel Itinerary</h2>
        <p><strong>Place:</strong> ${place}</p>
        <p><strong>Number of Days:</strong> ${days}</p>
        <p><strong>Travel Dates:</strong> ${startDate.toDateString()} - ${endDate.toDateString()}</p>
        <p><strong>Number of Passengers:</strong> ${passengers}</p>
        <p><strong>Radius of Reach:</strong> ${radius} km</p>
        <p><strong>Budget:</strong> Rs${budget}</p>`;

    for (let i = 1; i <= days; i++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i - 1);
        itineraryHtml += `<h3>Day ${i}</h3>
            <p><strong>Date:</strong> ${currentDate.toDateString()}</p>
            <p><strong>Timings:</strong> Example timings for transport and visiting places on this day.</p>`;
    }

    itineraryHtml += `<button id="recommendFlights" class="btn btn-primary">Recommend Flights</button>
        <button id="recommendHotels" class="btn btn-primary">Recommend Nearby Hotels</button>`;

    document.getElementById('resultContainer').innerHTML = itineraryHtml;

    // Fetch suggested places to visit
    const places = await fetchPlaces(place);
    let placesHtml = `<h2>Suggested Places to Visit</h2>`;
    places.forEach((place, index) => {
        placesHtml += `<p>${index + 1}. ${place.name}</p>`;
    });
    document.getElementById('placesContainer').innerHTML = placesHtml;

    // Handle button clicks
    document.getElementById('recommendFlights').addEventListener('click', function() {
        // Call API or show flight recommendations
        alert('Flight recommendations will be provided.');
    });

    document.getElementById('recommendHotels').addEventListener('click', function() {
        // Call API or show hotel recommendations
        alert('Hotel recommendations will be provided.');
    });
});

// Function to fetch suggested places
const fetchPlaces = async (location) => {
    const apiKey = 'tnSxO11zZPWoASNJ5Zkb-eBx_VwLP7p5a4gmJ0LU6BU'; // Replace with your Google Places API key
    // Geocode location to get latitude and longitude
    const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`);
    const geocodeData = await geocodeResponse.json();
    const { lat, lng } = geocodeData.results[0].geometry.location;
    // Fetch places
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&key=${apiKey}`);
    const data = await response.json();
    return data.results;
};


// Auto-fill End Date based on Start Date and Number of Days
document.getElementById('days').addEventListener('change', function() {
    const days = parseInt(this.value, 10);
    const startDate = new Date(document.getElementById('startDate').value);
    if (days && startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + days - 1);
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    }
});

document.getElementById('startDate').addEventListener('change', function() {
    const startDate = new Date(this.value);
    const days = parseInt(document.getElementById('days').value, 10);
    if (days && startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + days - 1);
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    }
});