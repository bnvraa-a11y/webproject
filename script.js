const CONFIG = {
    bgScrolled: "#000000",
    bgDefault: "#0a1628",
    scrollThreshold: 50,
    apiUrl: "http://localhost:5028/api/cars",
    // Folder that contains the car images, relative to index.html.
    // Leave as "./" if the images sit next to index.html.
    // If they live in a folder, use e.g. "./images/".
    imageBase: "./",
    // Shown when an image fails to load (inline SVG, no extra file needed)
    fallbackImage:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250'>" +
            "<rect width='100%' height='100%' fill='#13233d'/>" +
            "<text x='50%' y='50%' fill='#7f93b2' font-family='sans-serif' " +
            "font-size='20' text-anchor='middle' dominant-baseline='middle'>" +
            "Image unavailable</text></svg>"
        )
};

const header = document.querySelector("header");
const logo = document.querySelector(".logo h1");
const bookingForm = document.querySelector("#contact form");
const carsContainer = document.querySelector(".cars-grid");
const carSelect = document.getElementById("car");

// Header Scroll Effect
const handleScroll = () => {
    if (!header) return;

    header.style.backgroundColor =
        window.scrollY > CONFIG.scrollThreshold
            ? CONFIG.bgScrolled
            : CONFIG.bgDefault;
};

// Build a safe image URL (handles spaces, relative names and full URLs)
function resolveImageUrl(url) {
    if (!url) return "";

    const clean = String(url).trim();

    // Absolute URL, root-relative path, or data URI: use as-is
    if (/^(https?:)?\/\//i.test(clean) || clean.startsWith("/") || clean.startsWith("data:")) {
        return clean;
    }

    // Already starts with ./ or ../
    if (clean.startsWith("./") || clean.startsWith("../")) {
        return encodeURI(clean);
    }

    // Plain file name like "audi6.webp" -> add the image folder
    return encodeURI(CONFIG.imageBase + clean);
}

// Replace a broken image with the fallback (once)
function attachImageFallback(img) {
    img.addEventListener("error", () => {
        if (img.dataset.failed) return;
        img.dataset.failed = "true";
        console.warn("Image failed to load:", img.getAttribute("src"));
        img.src = CONFIG.fallbackImage;
    });
}

// Select Car and Scroll to Booking Form
function selectCar(carValue) {
    if (carSelect) {
        carSelect.value = carValue;
    }

    document.getElementById("contact")?.scrollIntoView({
        behavior: "smooth"
    });
}

// Connect Existing HTML Buttons
function connectStaticButtons() {
    const buttons = document.querySelectorAll(".car-card button");

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const carValues = ["tesla", "bmw", "audi", "rolls"];
            selectCar(carValues[index]);
        });
    });

    // Static images in the HTML also get the fallback
    document.querySelectorAll(".car-card img").forEach(attachImageFallback);
}

// Find the <option> that matches a car coming from the API
function findCarOption(car) {
    if (!carSelect) return null;

    const options = Array.from(carSelect.options);
    const fullName = `${car.brand} ${car.model}`.toLowerCase();
    const brand = String(car.brand || "").toLowerCase();

    // 1) Exact full name, 2) brand only (e.g. "Rolls-Royce Ghost" -> "Rolls-Royce")
    return (
        options.find(o => o.text.toLowerCase().includes(fullName)) ||
        options.find(o => brand && o.text.toLowerCase().includes(brand)) ||
        null
    );
}

// Load Cars from ASP.NET Core API
async function loadCars() {
    if (!carsContainer) return;

    try {
        const response = await fetch(CONFIG.apiUrl);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const cars = await response.json();

        if (!Array.isArray(cars)) {
            throw new Error("Invalid cars data");
        }

        carsContainer.innerHTML = "";

        cars.forEach(car => {
            const card = document.createElement("div");
            card.className = "car-card";

            if (car.imageUrl) {
                const img = document.createElement("img");
                img.src = resolveImageUrl(car.imageUrl);
                img.alt = `${car.brand} ${car.model}`;
                img.loading = "lazy";
                attachImageFallback(img);
                card.appendChild(img);
            }

            const info = document.createElement("div");
            info.className = "car-info";

            const title = document.createElement("h3");
            title.textContent = `${car.brand} ${car.model}`;

            const price = document.createElement("p");
            price.textContent = `Price: $${car.price}/day`;

            const button = document.createElement("button");
            button.textContent = "Rent Now";
            button.type = "button";

            button.addEventListener("click", () => {
                const option = findCarOption(car);

                if (option) {
                    carSelect.value = option.value;
                }

                document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth"
                });
            });

            info.append(title, price, button);
            card.appendChild(info);
            carsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("API Connection Error:", error);
        // Keep the original HTML cars if API is unavailable.
    }
}

// Booking Form Validation
function handleFormSubmit(event) {
    event.preventDefault();

    if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
    }

    const formData = new FormData(bookingForm);

    const booking = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        countryFrom: formData.get("country-from"),
        countryIn: formData.get("country-in"),
        car: formData.get("car")
    };

    console.log("Booking Information:", booking);

    alert("Success! Your booking request has been received.");

    bookingForm.reset();
}

// Logo Click
logo?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Initialize Website
document.addEventListener("DOMContentLoaded", () => {
    connectStaticButtons();
    loadCars();
    handleScroll();
});

bookingForm?.addEventListener("submit", handleFormSubmit);

window.addEventListener("scroll", handleScroll);