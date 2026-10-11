const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const searchContainer = document.getElementById("searchContainer");
const mobileSearch = document.getElementById("mobileSearch");
const searchInput = document.getElementById("searchInput");

// ==============================
// HAMBURGER MENU TOGGLE
// ==============================
if(hamburger && navLinks){
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
        
        // Agar mobile menu open ho raha hai, toh search box ko automatic close karein
        if(navLinks.classList.contains("active") && searchContainer) {
            searchContainer.classList.remove("search-active");
        }
    });
}

// ==============================
// CLOSE MENU WHEN LINK CLICKED
// ==============================
const navItems = document.querySelectorAll(".nav-links a");
navItems.forEach(item => {
    item.addEventListener("click", () => {
        if(hamburger && navLinks){
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        }
    });
});

// ==============================
// MOBILE SEARCH TOGGLE (LEFT OF HAMBURGER)
// ==============================
if(mobileSearch && searchContainer){
    mobileSearch.addEventListener("click", (e) => {
        e.stopPropagation(); // Click event ko document par spread hone se rokein
        searchContainer.classList.toggle("search-active");

        // Agar search bar open hota hai, toh menu panel ko instant close karein
        if(searchContainer.classList.contains("search-active")) {
            if(hamburger) hamburger.classList.remove("active");
            if(navLinks) navLinks.classList.remove("active");
            if(searchInput) {
                // Responsive mobile devices par layout crash se bachne ke liye thoda delay diya hai
                setTimeout(() => {
                    searchInput.focus();
                }, 100);
            }
        }
    });
}

// Screen par kahin bhi bahar click karne se mobile search bar auto close ho jaye
document.addEventListener("click", (e) => {
    if (searchContainer && !searchContainer.contains(e.target) && e.target !== mobileSearch) {
        searchContainer.classList.remove("search-active");
    }
});

// ==============================
// STATS COUNTER ENGINE
// ==============================
const counters = document.querySelectorAll(".counter");
const speed = 120;
counters.forEach(counter => {
    const animateCounter = () => {
        const target = +counter.getAttribute("data-target");
        const current = +counter.innerText;
        const increment = Math.ceil(target / speed);
        if(current < target){
            counter.innerText = current + increment;
            setTimeout(animateCounter,20);
        } else {
            counter.innerText = target + "+";
        }
    };
    animateCounter();
});

// ==============================
// NAVBAR SCROLL FX EFFECT
// ==============================
const navbar = document.querySelector(".navbar");
if(navbar){
    window.addEventListener("scroll", () => {
        if(window.scrollY > 50){
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

// ==============================
// SCROLL REVEAL ENGINE
// ==============================
const revealElements = document.querySelectorAll(
".service-card, .work-card, .stat-card, .team-member, .feature-item"
);

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;
        if(elementTop < windowHeight - revealPoint){
            element.classList.add("show");
        }
    });
};

window.addEventListener("scroll",revealOnScroll);
revealOnScroll();

// ==============================
// ACTIVE LINK SCROLL TRACKER
// ==============================
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-links li a");
window.addEventListener("scroll", () => {
    let current = ""; 
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if(window.pageYOffset >= sectionTop - 200){
            current = section.getAttribute("id");
        }
    });
    navLi.forEach(a => {
        a.classList.remove("active-link");
        if(a.getAttribute("href").includes(current)){
            a.classList.add("active-link");
        }
    });
});

// ==============================
// ADVANCED KEYWORD SEARCH LOGIC
// ==============================
const serviceCards = document.querySelectorAll(".service-card");
const serviceList = document.getElementById("serviceList");
const searchStatus = document.getElementById("searchStatus");

const serviceKeywords = {
    doctor: ["clinic", "medical", "health", "treatment", "checkup", "hospital", "physician", "illness", "fever"],
    plumber: ["pipe", "leak", "water", "drain", "tap", "bathroom", "toilet", "plumbing"],
    electrician: ["wire", "light", "fan", "short circuit", "board", "power", "current", "ac repair"],
    tutor: ["teacher", "study", "class", " tuition", "coaching", "education", "home tuition", "online class"],
    cleaner: ["house keeping", "dusting", "washing", "broom", "maid", "sofa dry cleaning", "deep cleaning"],
    machanic: ["bike", "car", "engine", "puncture", "repairing", "garage", "automotive"],
    automobile: ["cab", "taxi", "rent", "travel", "ride", "booking", "car hire", "tourist bus"]
};

function showServices(filter = "") {
    if(!serviceList) return;
    serviceList.innerHTML = "";
    let foundCount = 0;
    const cleanFilter = filter.toLowerCase().trim();

    serviceCards.forEach(card => {
        const service = card.dataset.service ? card.dataset.service.toLowerCase() : "";
        const title = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
        const desc = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";
        
        const keywords = serviceKeywords[service] || [];

        const isMatch = service.includes(cleanFilter) || 
                        title.includes(cleanFilter) || 
                        desc.includes(cleanFilter) || 
                        keywords.some(kw => kw.includes(cleanFilter));

        if (isMatch) {
            foundCount++;
            card.classList.remove("hide");

            if (cleanFilter !== "") {
                const item = document.createElement("div");
                item.classList.add("service-item");
                item.innerText = card.querySelector("h3") ? card.querySelector("h3").innerText : service;
                
                item.addEventListener("click", () => {
                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                    if (bookingModal) {
                        bookingTitle.innerText = `Book ${card.querySelector("h3") ? card.querySelector("h3").innerText : service}`;
                        bookingModal.classList.add("active");
                    }
                });
                serviceList.appendChild(item);
            }
        } else {
            if(cleanFilter !== "") {
                card.classList.add("hide");
            } else {
                card.classList.remove("hide");
            }
        }
    });

    if(searchStatus) {
        if (cleanFilter === "") {
            searchStatus.innerText = "Showing all services";
            serviceCards.forEach(c => c.classList.remove("hide"));
        } else if (foundCount > 0) {
            searchStatus.innerText = `Search results for "${filter}" (${foundCount} found)`;
        } else {
            searchStatus.innerText = "No matching services found";
        }
    }
}

// Initial Core Execution
showServices("");

if(searchInput){
    searchInput.addEventListener("input", () => {
        showServices(searchInput.value);
    });
}

// ==============================
// BOOKING MODAL POPUP ENGINE
// ==============================
const bookingModal = document.getElementById("bookingModal");
const bookingTitle = document.getElementById("bookingTitle");
const closeModal = document.getElementById("closeModal");
if(serviceCards.length > 0){
    serviceCards.forEach(card => {
        card.addEventListener("click", () => {
            if(bookingModal){
                const serviceName = card.querySelector("h3") ? card.querySelector("h3").innerText : (card.dataset.service || "Service");
                bookingTitle.innerText = `Book ${serviceName}`;
                bookingModal.classList.add("active");
            }
        });
    });
}

if(closeModal){
    closeModal.addEventListener("click", () => {
        bookingModal.classList.remove("active");
    });
}

window.addEventListener("click", (e) => {
    if(e.target === bookingModal){
        bookingModal.classList.remove("active");
    }
});

const searchBtn = document.getElementById("searchBtn");
if(searchBtn && searchInput){
    searchBtn.addEventListener("click", () => {
        searchInput.focus();
    });
}

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

// =======================================================
// DOM ENGINE: GPS SYSTEM, VALIDATION & HERO TREND CHIPS
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const gpsBtn = document.getElementById("gpsBtn");
    const userLocationInput = document.getElementById("userLocation");
    const bookingForm = document.getElementById("bookingForm");
    const bookingPhone = document.getElementById("bookingPhone");

    // --- FEATURE 1: DEFAULT TRENDING CHIPS FOR BLANK HERO SPACE ---
    if (serviceList && serviceList.children.length === 0) {
        const trendingServices = ["doctor", "plumber", "electrician", "tutor"];
        
        trendingServices.forEach(serviceName => {
            const item = document.createElement("div");
            item.classList.add("service-item");
            item.style.border = "1px solid rgba(73, 214, 255, 0.3)";
            item.innerText = `🔥 ${serviceName}`;
            
            item.addEventListener("click", () => {
                const targetCard = document.querySelector(`.service-card[data-service="${serviceName}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
                    
                    if (typeof bookingModal !== 'undefined' && bookingTitle) {
                        const titleText = targetCard.querySelector("h3") ? targetCard.querySelector("h3").innerText : serviceName;
                        bookingTitle.innerText = `Book ${titleText}`;
                        bookingModal.classList.add("active");
                    }
                }
            });
            serviceList.appendChild(item);
        });
    }

    // --- FEATURE 2: STRICT 10-DIGIT NUMBER ONLY VALIDATION ---
    if (bookingPhone) {
        bookingPhone.addEventListener("keydown", (e) => {
            const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
            if (allowedKeys.includes(e.key)) {
                return;
            }
            if (e.key < "0" || e.key > "9") {
                e.preventDefault();
            }
        });

        bookingPhone.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    }

    // --- FEATURE 3: UPDATED GPS GEOLOCATION ENGINE WITH ANIMATION ---
    if (gpsBtn && userLocationInput) {
        gpsBtn.addEventListener("click", () => {
            // Loading state toggle: icon spin hone lagega
            gpsBtn.classList.add("loading");
            const icon = gpsBtn.querySelector("i");
            
            // Icon temporarily change hoke spinner ya loading vibe dega
            if(icon) {
                icon.className = "fa-solid fa-circle-notch";
            }
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        
                        try {
                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                            const data = await response.json();
                            
                            if (data && data.display_name) {
                                userLocationInput.value = data.display_name;
                            } else {
                                userLocationInput.value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
                            }
                            // Label positioning ko trigger karne ke liye dispatch event
                            userLocationInput.dispatchEvent(new Event('input', { bubbles: true }));
                        } catch (error) {
                            userLocationInput.value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
                        } finally {
                            // Reset button UI
                            gpsBtn.classList.remove("loading");
                            if(icon) icon.className = "fa-solid fa-location-dot";
                        }
                    },
                    (error) => {
                        gpsBtn.classList.remove("loading");
                        if(icon) icon.className = "fa-solid fa-location-dot";
                        
                        if (error.code === error.PERMISSION_DENIED) {
                            alert("Location access denied. Please type your location manually.");
                        } else {
                            alert("GPS Error. Please enter location manually.");
                        }
                    },
                    { enableHighAccuracy: true, timeout: 8000 }
                );
            } else {
                gpsBtn.classList.remove("loading");
                if(icon) icon.className = "fa-solid fa-location-dot";
                alert("Geolocation is not supported by your browser.");
            }
        });
    }

    // --- FEATURE 4: FINAL FORM SUBMIT VALIDATION ---
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            if (bookingPhone && bookingPhone.value.length !== 10) {
                alert("Please enter exactly 10 digits for mobile number.");
                bookingPhone.focus();
                return;
            }

            alert("Booking request processed successfully!");
            if (typeof bookingModal !== 'undefined' && bookingModal) {
                bookingModal.classList.remove("active");
            }
            bookingForm.reset();
        });
    }
});