const CONFIG = {
    bgScrolled: "#000000",
    bgDefault: "#0a1628",
    scrollThreshold: 50
};

let rentCount = Number(localStorage.getItem("totalRents")) || 0;


const header = document.querySelector("header");
const logo = document.querySelector(".logo h1");
const rentButtons = document.querySelectorAll(".car-info button");
const bookingForm = document.querySelector("#contact form");


const handleRentClick = () => {
    rentCount++;
    localStorage.setItem("totalRents", rentCount);
    console.log(`Total Rents: ${rentCount}`);
    alert(`Car Booked! Total: ${rentCount}`);
};

const handleFormSubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const countryFrom = document.getElementById("country-from").value.trim();
    const countryIn = document.getElementById("country-in").value.trim();

    if (!name || !phone || !email || !countryFrom || !countryIn) {
        return alert("⚠️ You must complete the text first!");
    }

    alert(`✅ Success! Thanks, ${name}. Your booking request is sent.`);
    bookingForm.reset();
};


const handleScroll = () => {
    header.style.backgroundColor = window.scrollY > CONFIG.scrollThreshold 
        ? CONFIG.bgScrolled 
        : CONFIG.bgDefault;
};

logo?.addEventListener("click", () => alert("CRS 🚗"));

rentButtons.forEach(btn => btn.addEventListener("click", handleRentClick));

bookingForm?.addEventListener("submit", handleFormSubmit);

window.addEventListener("scroll", handleScroll);
