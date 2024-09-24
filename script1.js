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

    // Fetch suggested places to visit
    const places = await fetchPlaces(place, radius);

    // Generate itinerary
    let itineraryHtml = `<h2>Travel Itinerary</h2>
        <p><strong>Place:</strong> ${place}</p>
        <p><strong>Number of Days:</strong> ${days}</p>
        <p><strong>Travel Dates:</strong> ${startDate.toDateString()} - ${endDate.toDateString()}</p>
        <p><strong>Number of Passengers:</strong> ${passengers}</p>
        <p><strong>Radius of Reach:</strong> ${radius} km</p>
        <p><strong>Budget:</strong> Rs${budget}</p>`;

    // Assign places to days in the itinerary
    for (let i = 1; i <= days; i++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i - 1);
        itineraryHtml += `<h3>Day ${i}</h3>
            <p><strong>Date:</strong> ${currentDate.toDateString()}</p>`;
        
        const placeIndex = (i - 1) % places.length; // Rotate through the places
        const placeData = places[placeIndex];
        itineraryHtml += `<p><strong>Place to Visit:</strong> ${placeData.name}</p>
            <p><strong>Address:</strong> ${placeData.vicinity}</p>`;
    }

    itineraryHtml += `<button id="recommendFlights" class="btn btn-primary">Recommend Flights</button>
        <button id="recommendHotels" class="btn btn-primary">Recommend Nearby Hotels</button>`;

    document.getElementById('resultContainer').innerHTML = itineraryHtml;

    // Handle button clicks
    document.getElementById('recommendFlights').addEventListener('click', function() {
        alert('Flight recommendations will be provided.');
    });

    document.getElementById('recommendHotels').addEventListener('click', function() {
        alert('Hotel recommendations will be provided.');
    });
});

// Function to fetch suggested places
const fetchPlaces = async (location, radius) => {
    const apiKey = 'tnSxO11zZPWoASNJ5Zkb-eBx_VwLP7p5a4gmJ0LU6BU'; // Replace with your Google Places API key
    try {
        // Geocode location to get latitude and longitude
        const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`);
        const geocodeData = await geocodeResponse.json();
        const { lat, lng } = geocodeData.results[0]?.geometry.location || {};

        // Fetch places using the latitude, longitude, and radius
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius * 1000}&key=${apiKey}`);
        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error(data.error_message || 'Failed to fetch places');
        }
        return data.results;
    } catch (error) {
        console.error('Error fetching places:', error);
        alert('There was an error fetching places. Please try again later.');
        return [];
    }
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
