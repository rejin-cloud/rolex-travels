/**
 * Rolex Travels - Interactive Web Application Logic
 * Modern High-Impact Travel Experience
 * Typewriter Search, Multi-Service Engine, Real-time Currency Converter & Visa Calculator
 */

// Exchange Rates relative to AED (Base Currency)
const CURRENCY_RATES = {
    AED: { rate: 1.0, symbol: "AED" },
    INR: { rate: 22.8, symbol: "₹" },
    USD: { rate: 0.272, symbol: "$" },
    SAR: { rate: 1.02, symbol: "SAR" },
    EUR: { rate: 0.25, symbol: "€" }
};

let currentCurrency = "AED";

// Visa Pricing Matrix
const VISA_DATA = {
    uae: {
        "30days": { fee: 330, time: "24 - 48 Hours" },
        "60days": { fee: 650, time: "24 - 48 Hours" },
        "multiple30": { fee: 850, time: "2 - 3 Days" },
        "multiple60": { fee: 1350, time: "2 - 3 Days" }
    },
    saudi: {
        "30days": { fee: 520, time: "Instant E-Visa (24h)" },
        "60days": { fee: 750, time: "1 - 2 Days" },
        "multiple30": { fee: 950, time: "2 Days" },
        "multiple60": { fee: 1200, time: "2 Days" }
    },
    schengen: {
        "30days": { fee: 750, time: "10 - 15 Working Days" },
        "60days": { fee: 950, time: "15 Working Days" },
        "multiple30": { fee: 1100, time: "15 Working Days" },
        "multiple60": { fee: 1400, time: "15 Working Days" }
    },
    uk: {
        "30days": { fee: 890, time: "15 Working Days" },
        "60days": { fee: 1200, time: "15 Working Days" },
        "multiple30": { fee: 1400, time: "15 Working Days" },
        "multiple60": { fee: 1900, time: "15 Working Days" }
    },
    usa: {
        "30days": { fee: 1250, time: "DS-160 + Appointment Booking" },
        "60days": { fee: 1250, time: "DS-160 + Appointment Booking" },
        "multiple30": { fee: 1250, time: "DS-160 + Appointment Booking" },
        "multiple60": { fee: 1250, time: "DS-160 + Appointment Booking" }
    },
    singapore: {
        "30days": { fee: 240, time: "3 - 4 Working Days" },
        "60days": { fee: 380, time: "3 - 4 Working Days" },
        "multiple30": { fee: 450, time: "3 - 4 Working Days" },
        "multiple60": { fee: 600, time: "3 - 4 Working Days" }
    },
    malaysia: {
        "30days": { fee: 190, time: "48 Hours" },
        "60days": { fee: 320, time: "48 Hours" },
        "multiple30": { fee: 400, time: "3 Days" },
        "multiple60": { fee: 550, time: "3 Days" }
    },
    thailand: {
        "30days": { fee: 290, time: "3 - 5 Days" },
        "60days": { fee: 450, time: "3 - 5 Days" },
        "multiple30": { fee: 600, time: "5 Days" },
        "multiple60": { fee: 800, time: "5 Days" }
    },
    oman: {
        "30days": { fee: 220, time: "Instant E-Visa (24h)" },
        "60days": { fee: 390, time: "24 - 48 Hours" },
        "multiple30": { fee: 480, time: "24 - 48 Hours" },
        "multiple60": { fee: 680, time: "24 - 48 Hours" }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initCapsuleNav();
    initMobileNav();
    initCurrencySwitcher();
    initPackageFilters();
    initServicesShowcase();
    initFaq();
    initHeroSearch();
    initHeaderScroll();
    initServicesDropdown();
    updateVisaTypes();
});

// 1. Interactive Tabs Logic for All 8 Services
function initTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            tabButtons.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            tabPanels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            // Smoothly scroll active tab button into view when overflowing
            btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

            const activePanel = document.getElementById(targetTab);
            if (activePanel) activePanel.classList.add("active");
        });
    });
}

function switchToTab(tabId) {
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (targetBtn) {
        targetBtn.click();
        const section = document.getElementById("booking-engine-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
}

// 2. Main Header Capsule Navigation Active Highlight Tracking & Moving
function initCapsuleNav() {
    const navLinks = document.querySelectorAll(".capsule-nav .capsule-link");
    const dropdownBtn = document.getElementById("servicesDropdownBtn");
    const dropdownMenu = document.getElementById("servicesDropdownMenu");
    const dropdownLinks = document.querySelectorAll(".services-dropdown-menu .dropdown-service-link");

    // Click handler for top navigation links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active"));
            if (dropdownBtn) dropdownBtn.classList.remove("active");
            link.classList.add("active");
        });
    });

    // Dropdown links click handler
    dropdownLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active"));
            if (dropdownBtn) dropdownBtn.classList.add("active");
            if (dropdownMenu) dropdownMenu.classList.remove("show");
        });
    });

    // Scroll Spy: Automatically update active highlight based on visible section
    const sections = [
        { id: "hero", navSelector: null },
        { id: "booking-engine-section", navSelector: "a[href='#booking-engine']" },
        { id: "destined-travel", navSelector: null },
        { id: "services", navSelector: "#servicesDropdownBtn" },
        { id: "packages", navSelector: "a[href='#packages']" },
        { id: "why-choose", navSelector: "a[href='#why-choose']" },
        { id: "faq", navSelector: "a[href='#faq']" }
    ];

    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY + 220;

        for (let i = sections.length - 1; i >= 0; i--) {
            const sec = document.getElementById(sections[i].id);
            if (sec && sec.offsetTop <= scrollPos) {
                if (sections[i].navSelector) {
                    const activeLink = document.querySelector(`.capsule-nav ${sections[i].navSelector}`);
                    if (activeLink && !activeLink.classList.contains("active")) {
                        navLinks.forEach(l => l.classList.remove("active"));
                        if (dropdownBtn) dropdownBtn.classList.remove("active");
                        activeLink.classList.add("active");
                    }
                }
                break;
            }
        }
    }, { passive: true });
}

// 2. Mobile Nav Drawer & Dropdown
function initMobileNav() {
    const toggle = document.getElementById("mobileToggle");
    const nav = document.getElementById("capsuleNav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("mobile-active");
        });

        // Close on link click
        const links = nav.querySelectorAll(".capsule-link");
        links.forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("mobile-active");
            });
        });
    }
}

function initServicesDropdown() {
    const btn = document.getElementById("servicesDropdownBtn");
    const menu = document.getElementById("servicesDropdownMenu");

    if (btn && menu) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("show");
            btn.setAttribute("aria-expanded", menu.classList.contains("show"));
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.classList.remove("show");
                btn.setAttribute("aria-expanded", "false");
            }
        });
    }
}

// 3. Header Scroll Effect
function initHeaderScroll() {
    const header = document.getElementById("mainHeader");
    if (!header) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// 4. Comprehensive Search Database of Famous Holiday Spots & Destinations
const SEARCH_DATABASE = [
    {
        name: "Bali, Indonesia",
        category: "holidays",
        tag: "Top Holiday Spot",
        subtitle: "Ubud Swings, Nusa Penida & Private Pool Villas",
        price: "From AED 1,850",
        flagCode: "id",
        keywords: ["bali", "indonesia", "beach", "island", "honeymoon", "villa", "asia", "ubud", "denpasar", "b"]
    },
    {
        name: "Bangkok & Phuket, Thailand",
        category: "holidays",
        tag: "Trending Holiday",
        subtitle: "Phi Phi Islands, Night Markets & Floating Bazaars",
        price: "From AED 1,450",
        flagCode: "th",
        keywords: ["bangkok", "phuket", "thailand", "pattaya", "krabi", "beach", "shopping", "asia", "b"]
    },
    {
        name: "Baku, Azerbaijan",
        category: "holidays",
        tag: "Visa On Arrival",
        subtitle: "Flame Towers, Old City & Caucasian Mountains",
        price: "From AED 1,299",
        flagCode: "az",
        keywords: ["baku", "azerbaijan", "caucasus", "europe", "snow", "shahdag", "b"]
    },
    {
        name: "Barcelona & Madrid, Spain",
        category: "holidays",
        tag: "Europe Special",
        subtitle: "Sagrada Familia, Costa Brava & Schengen Visa",
        price: "From AED 3,200",
        flagCode: "es",
        keywords: ["barcelona", "madrid", "spain", "europe", "schengen", "football", "b"]
    },
    {
        name: "Berlin & Munich, Germany",
        category: "holidays",
        tag: "Schengen Tour",
        subtitle: "Bavarian Castles, Black Forest & Rhine Valley",
        price: "From AED 3,450",
        flagCode: "de",
        keywords: ["berlin", "munich", "germany", "frankfurt", "europe", "schengen", "b"]
    },
    {
        name: "Beirut, Lebanon",
        category: "holidays",
        tag: "Middle East Pearl",
        subtitle: "Mediterranean Coast, Jeita Grotto & Cuisine",
        price: "From AED 1,600",
        flagCode: "lb",
        keywords: ["beirut", "lebanon", "mediterranean", "middle east", "b"]
    },
    {
        name: "Bahrain",
        category: "visa",
        tag: "GCC Express Visa",
        subtitle: "Manama Pearl Diving & Weekend Getaways",
        price: "From AED 450",
        flagCode: "bh",
        keywords: ["bahrain", "manama", "gcc", "visa", "b"]
    },
    {
        name: "Dubai & Abu Dhabi, UAE",
        category: "visa",
        tag: "Best Seller",
        subtitle: "Burj Khalifa, Desert Safari & 30/60d Instant Visas",
        price: "From AED 330",
        flagCode: "ae",
        keywords: ["dubai", "abu dhabi", "uae", "sharjah", "burj khalifa", "visa", "safari", "d"]
    },
    {
        name: "Makkah & Madinah Umrah",
        category: "umrah",
        tag: "Sacred Pilgrimage",
        subtitle: "5★ Clock Tower VIP Hotels, Guided Ziyarat & Visa",
        price: "From AED 2,250",
        flagCode: "sa",
        keywords: ["makkah", "madinah", "umrah", "hajj", "saudi", "haram", "kaaba", "jeddah", "pilgrimage", "m", "u"]
    },
    {
        name: "Maldives Overwater Luxury",
        category: "holidays",
        tag: "Island Paradise",
        subtitle: "All-Inclusive Overwater Villas, Snorkeling & Seaplanes",
        price: "From AED 2,800",
        flagCode: "mv",
        keywords: ["maldives", "male", "resort", "island", "honeymoon", "beach", "luxury", "m"]
    },
    {
        name: "London & Scotland, UK",
        category: "flights",
        tag: "Direct Fares",
        subtitle: "Big Ben, Edinburgh Castle & UK Tourist Visas",
        price: "From AED 1,450",
        flagCode: "gb",
        keywords: ["london", "uk", "britain", "scotland", "edinburgh", "manchester", "l"]
    },
    {
        name: "Switzerland Alpine Dream",
        category: "holidays",
        tag: "Scenic Wonder",
        subtitle: "Mount Titlis, Glacier 3000, Interlaken & Trains",
        price: "From AED 3,850",
        flagCode: "ch",
        keywords: ["switzerland", "swiss", "interlaken", "zurich", "geneva", "alps", "snow", "s"]
    },
    {
        name: "Georgia (Tbilisi & Kazbegi)",
        category: "holidays",
        tag: "Trending Mountain Tour",
        subtitle: "Ancient Churches, Snow Peaks & Visa-Free Stays",
        price: "From AED 1,150",
        flagCode: "ge",
        keywords: ["georgia", "tbilisi", "kazbegi", "batumi", "mountains", "snow", "g"]
    },
    {
        name: "Istanbul & Cappadocia, Turkey",
        category: "holidays",
        tag: "Hot Air Balloon",
        subtitle: "Bosphorus Cruises, Hagia Sophia & Cave Suites",
        price: "From AED 2,100",
        flagCode: "tr",
        keywords: ["turkey", "istanbul", "cappadocia", "antalya", "balloon", "t"]
    },
    {
        name: "Paris & French Riviera, France",
        category: "holidays",
        tag: "Romance & Art",
        subtitle: "Eiffel Tower, Louvre Museum, Nice & Schengen Visas",
        price: "From AED 3,100",
        flagCode: "fr",
        keywords: ["paris", "france", "nice", "eiffel tower", "europe", "p", "f"]
    },
    {
        name: "Kashmir (Paradise on Earth)",
        category: "holidays",
        tag: "Domestic Favorite",
        subtitle: "Gulmarg Gondola, Dal Lake Houseboats & Pahalgam",
        price: "From ₹ 18,500",
        flagCode: "in",
        keywords: ["kashmir", "srinagar", "gulmarg", "pahalgam", "india", "snow", "k"]
    },
    {
        name: "Kerala Backwaters & Munnar",
        category: "holidays",
        tag: "Nature & Tea Hills",
        subtitle: "Alleppey Houseboat, Spice Plantations & Waterfalls",
        price: "From ₹ 14,500",
        flagCode: "in",
        keywords: ["kerala", "munnar", "alleppey", "cochin", "india", "houseboat", "k"]
    },
    {
        name: "Tokyo & Kyoto, Japan",
        category: "holidays",
        tag: "Cherry Blossom Tour",
        subtitle: "Bullet Train (Shinkansen), Mount Fuji & Temples",
        price: "From AED 4,200",
        flagCode: "jp",
        keywords: ["tokyo", "kyoto", "japan", "osaka", "fuji", "asia", "t", "j"]
    },
    {
        name: "Singapore & Sentosa Island",
        category: "holidays",
        tag: "Family Theme Parks",
        subtitle: "Universal Studios, Marina Bay & Night Safari",
        price: "From AED 2,350",
        flagCode: "sg",
        keywords: ["singapore", "sentosa", "universal studios", "marina bay", "asia", "s"]
    },
    {
        name: "Kuala Lumpur & Langkawi, Malaysia",
        category: "holidays",
        tag: "Tropical Holiday",
        subtitle: "Petronas Towers, Cable Car, Sky Bridge & Visa",
        price: "From AED 1,650",
        flagCode: "my",
        keywords: ["kuala lumpur", "langkawi", "malaysia", "penang", "genting", "m", "k"]
    },
    {
        name: "Cairo & Nile Cruise, Egypt",
        category: "holidays",
        tag: "Ancient Wonders",
        subtitle: "Giza Pyramids, Sphinx, Luxor & Aswan 5★ Cruise",
        price: "From AED 1,890",
        flagCode: "eg",
        keywords: ["cairo", "egypt", "pyramids", "nile", "luxor", "e"]
    }
];

// Helper to highlight matching text in search results
function highlightSearchMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
    return text.replace(regex, '<mark class="search-match">$1</mark>');
}

// Render dynamic search suggestions
function renderSearchSuggestions(query = "") {
    const dropdown = document.getElementById("searchSuggestionsDropdown");
    if (!dropdown) return;

    const trimmed = query.trim().toLowerCase();
    let matches = [];

    if (!trimmed) {
        // Show Top Trending when query is empty
        matches = SEARCH_DATABASE.slice(0, 8);
    } else {
        // Filter based on name, subtitle, and keywords
        matches = SEARCH_DATABASE.filter(item => {
            const inName = item.name.toLowerCase().includes(trimmed);
            const inSub = item.subtitle.toLowerCase().includes(trimmed);
            const inKeys = item.keywords.some(k => k.toLowerCase().startsWith(trimmed) || k.toLowerCase().includes(trimmed));
            return inName || inSub || inKeys;
        });
    }

    let headerHtml = "";
    if (!trimmed) {
        headerHtml = `
            <div class="suggestions-header">
                <span><i class="fa-solid fa-fire"></i> Trending Destinations & Famous Holiday Spots</span>
                <span class="results-count">${matches.length} Popular</span>
            </div>
        `;
    } else {
        headerHtml = `
            <div class="suggestions-header">
                <span><i class="fa-solid fa-compass"></i> Holiday Places & Packages for "${query}"</span>
                <span class="results-count">${matches.length} Found</span>
            </div>
        `;
    }

    let cardsHtml = "";
    if (matches.length > 0) {
        cardsHtml = matches.map(item => `
            <div class="suggestion-card" onclick="selectSearchDestination('${item.name.replace(/'/g, "\\'")}', '${item.category}')">
                <div class="sugg-left-wrap">
                    <img src="https://flagcdn.com/w80/${item.flagCode}.png" alt="${item.name}" class="sugg-flag-img" loading="lazy">
                    <div class="sugg-info">
                        <div class="sugg-title-row">
                            <strong>${highlightSearchMatch(item.name, trimmed)}</strong>
                            <span class="sugg-tag-pill">${item.tag}</span>
                        </div>
                        <span class="sugg-sub-desc">${item.subtitle}</span>
                    </div>
                </div>
                <div class="sugg-right-wrap">
                    <span class="sugg-price">${item.price}</span>
                    <span class="sugg-action-hint">Explore <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </div>
        `).join("");
    } else {
        cardsHtml = `
            <div class="no-results-box">
                <i class="fa-solid fa-plane-slash" style="font-size: 2rem; color: #E50914; margin-bottom: 8px; display: block;"></i>
                <h4>No direct match found for "${query}"</h4>
                <p>Looking for a custom trip, visa, or unlisted destination?</p>
                <button class="btn-custom-inquire" onclick="openEnquiryModal('Custom Trip Inquiry for: ${query.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-headset"></i> Request Custom Quote
                </button>
            </div>
        `;
    }

    dropdown.innerHTML = `
        ${headerHtml}
        <div class="suggestions-list">
            ${cardsHtml}
        </div>
    `;
}

// 4. Hero Search Bar Typewriter & Live Destination Autocomplete
function initHeroSearch() {
    const input = document.getElementById("heroSearchInput");
    const clearBtn = document.getElementById("clearSearchBtn");
    const dropdown = document.getElementById("searchSuggestionsDropdown");

    if (!input) return;

    // Typewriter Animated Placeholder
    const placeholders = [
        "Where are you travelling to?",
        "Search Bali, Maldives, Switzerland, London...",
        "Search Bangkok, Baku, Barcelona, Berlin...",
        "Apply for 30/60 Days UAE Express Visas...",
        "Book VIP 5★ Makkah & Madinah Umrah Tours..."
    ];

    let phIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isFocused = false;

    function typeEffect() {
        if (isFocused || input.value.length > 0) {
            return;
        }

        const currentText = placeholders[phIndex];

        if (isDeleting) {
            input.setAttribute("placeholder", currentText.substring(0, charIndex - 1));
            charIndex--;
        } else {
            input.setAttribute("placeholder", currentText.substring(0, charIndex + 1));
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phIndex = (phIndex + 1) % placeholders.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1200);

    // Initial render of trending destinations
    renderSearchSuggestions("");

    // Focus & Input events
    input.addEventListener("focus", () => {
        isFocused = true;
        renderSearchSuggestions(input.value);
        if (dropdown) dropdown.classList.add("show");
    });

    input.addEventListener("input", () => {
        const query = input.value;
        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? "flex" : "none";
        }
        renderSearchSuggestions(query);
        if (dropdown) dropdown.classList.add("show");
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            input.value = "";
            clearBtn.style.display = "none";
            renderSearchSuggestions("");
            input.focus();
        });
    }

    // Close suggestions on outside click
    document.addEventListener("click", (e) => {
        const searchContainer = document.querySelector(".hero-search-container");
        if (searchContainer && !searchContainer.contains(e.target)) {
            if (dropdown) dropdown.classList.remove("show");
            isFocused = false;
        }
    });
}

function handleHeroSearch(e) {
    e.preventDefault();
    const input = document.getElementById("heroSearchInput");
    const term = input ? input.value.trim() : "";

    if (term) {
        openEnquiryModal(`Travel Inquiry for: ${term}`);
    } else {
        const section = document.getElementById("booking-engine-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
}

function selectSearchDestination(destinationName, serviceTab) {
    const input = document.getElementById("heroSearchInput");
    const dropdown = document.getElementById("searchSuggestionsDropdown");
    const clearBtn = document.getElementById("clearSearchBtn");

    if (input) {
        input.value = destinationName;
    }
    if (clearBtn) {
        clearBtn.style.display = "flex";
    }
    if (dropdown) {
        dropdown.classList.remove("show");
    }

    // Auto-switch to corresponding service tab
    if (serviceTab) {
        switchToTab(`tab-${serviceTab}`);
        showToast(`Selected ${destinationName}. Opening ${serviceTab.toUpperCase()} options...`);
    }
}

// 5. Dynamic Currency Switcher
function initCurrencySwitcher() {
    const selector = document.getElementById("currencySelector");
    if (!selector) return;

    selector.addEventListener("change", (e) => {
        currentCurrency = e.target.value;
        recalculatePrices();
        updateVisaTypes();
        showToast(`Currency updated to ${currentCurrency}`);
    });
}

function recalculatePrices() {
    const priceElements = document.querySelectorAll(".price-value");
    const config = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES["AED"];

    priceElements.forEach(el => {
        const baseAed = parseFloat(el.getAttribute("data-base-aed"));
        if (!isNaN(baseAed)) {
            const converted = Math.round(baseAed * config.rate);
            const formatted = converted.toLocaleString();
            const symbolSpan = el.querySelector(".cur-symbol");
            const amountSpan = el.querySelector(".cur-amount");

            if (symbolSpan && amountSpan) {
                symbolSpan.textContent = config.symbol;
                amountSpan.textContent = formatted;
            }
        }
    });
}

// 6. Visa Calculator Logic
function updateVisaTypes() {
    const country = document.getElementById("visaCountry")?.value || "uae";
    const visaTypeSelect = document.getElementById("visaType");
    const speedSelect = document.getElementById("visaSpeed");
    const priceEl = document.getElementById("visaPrice");
    const timeEl = document.getElementById("visaTime");

    if (!visaTypeSelect || !priceEl || !timeEl) return;

    const selectedType = visaTypeSelect.value || "30days";
    const countryData = VISA_DATA[country] || VISA_DATA["uae"];
    const plan = countryData[selectedType] || { fee: 350, time: "2 - 3 Days" };

    let finalFee = plan.fee;
    const speed = speedSelect ? speedSelect.value : "normal";
    if (speed === "express") finalFee += 100;
    if (speed === "super-express") finalFee += 200;

    const config = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES["AED"];
    const converted = Math.round(finalFee * config.rate).toLocaleString();

    priceEl.textContent = `${config.symbol} ${converted}`;
    timeEl.textContent = plan.time;
}

function calculateVisa(e) {
    e.preventDefault();
    const countryEl = document.getElementById("visaCountry");
    const typeEl = document.getElementById("visaType");
    const country = countryEl ? countryEl.options[countryEl.selectedIndex].text : "UAE";
    const type = typeEl ? typeEl.options[typeEl.selectedIndex].text : "30 Days";
    openEnquiryModal(`Visa Application: ${country} (${type})`);
}

// 7. Popular Flight Route Quick Selection
function setFlightRoute(from, to) {
    const inputs = document.querySelectorAll("#tab-flights .form-input");
    if (inputs.length >= 2) {
        inputs[0].value = from;
        inputs[1].value = to;
        showToast(`Route set to ${from} ➔ ${to}`);
    }
}

// 8. Package Category Filters & Running Marquee Controls
function initPackageFilters() {
    const filterButtons = document.querySelectorAll("#packageFilters .filter-btn");
    const packageCards = document.querySelectorAll(".packages-track .pkg-card");
    const track = document.getElementById("packagesTrack");
    const prevBtn = document.getElementById("pkgPrevBtn");
    const nextBtn = document.getElementById("pkgNextBtn");
    const container = document.getElementById("packagesMarqueeContainer");

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");
            packageCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    card.classList.remove("filtered-dim");
                } else {
                    card.classList.add("filtered-dim");
                }
            });
        });
    });

    // Arrow Navigation Controls (manual nudging)
    if (prevBtn && nextBtn && track) {
        let currentOffset = 0;
        const step = 380;

        nextBtn.addEventListener("click", () => {
            track.classList.add("paused");
            container.scrollBy({ left: step, behavior: "smooth" });
            setTimeout(() => {
                track.classList.remove("paused");
            }, 3500);
        });

        prevBtn.addEventListener("click", () => {
            track.classList.add("paused");
            container.scrollBy({ left: -step, behavior: "smooth" });
            setTimeout(() => {
                track.classList.remove("paused");
            }, 3500);
        });
    }

    // Touch & Pointer Dragging Support
    if (container && track) {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener("mousedown", (e) => {
            isDown = true;
            track.classList.add("paused");
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener("mouseleave", () => {
            isDown = false;
            track.classList.remove("paused");
        });

        container.addEventListener("mouseup", () => {
            isDown = false;
            setTimeout(() => track.classList.remove("paused"), 1500);
        });

        container.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.6;
            container.scrollLeft = scrollLeft - walk;
        });
    }
}

// 9. General Search & Form Submissions
function handleSearch(e, serviceName) {
    e.preventDefault();
    openEnquiryModal(`${serviceName} Instant Quotation`);
}

function handleSubscribe(e) {
    e.preventDefault();
    const input = e.target.querySelector("input[type='email']");
    if (input && input.value) {
        showToast("Thank you for subscribing to Rolex Travels!");
        input.value = "";
    }
}

// 10. Universal Modal Management
function openEnquiryModal(serviceTitle) {
    const modal = document.getElementById("enquiryModal");
    const titleEl = document.getElementById("modalServiceTitle");
    if (titleEl && serviceTitle) {
        titleEl.textContent = serviceTitle;
    }
    if (modal) {
        modal.classList.add("active");
    }
}

function closeEnquiryModal() {
    const modal = document.getElementById("enquiryModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

function handleModalSubmit(e) {
    e.preventDefault();
    closeEnquiryModal();
    showToast("Your inquiry has been submitted! Our travel agent will contact you shortly.");
    e.target.reset();
}

// Close modal when clicking outside card
window.addEventListener("click", (e) => {
    const modal = document.getElementById("enquiryModal");
    if (e.target === modal) {
        closeEnquiryModal();
    }
});

// 11. Toast Notifications
function showToast(message) {
    const toast = document.getElementById("toastNotification");
    const msgSpan = document.getElementById("toastMessage");
    if (!toast || !msgSpan) return;

    msgSpan.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

// 12. FAQ Accordion Toggle & Category Filtering
function toggleFaq(headerButton) {
    const card = headerButton.closest(".faq-card");
    if (!card) return;

    const isCurrentlyActive = card.classList.contains("active");
    const allCards = document.querySelectorAll(".faq-card");

    // Accordion mode: close other active cards
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove("active");
            const btn = c.querySelector(".faq-card-header");
            if (btn) btn.setAttribute("aria-expanded", "false");
        }
    });

    if (isCurrentlyActive) {
        card.classList.remove("active");
        headerButton.setAttribute("aria-expanded", "false");
    } else {
        card.classList.add("active");
        headerButton.setAttribute("aria-expanded", "true");
    }
}

function initFaq() {
    const chips = document.querySelectorAll("#faqFilterChips .faq-chip");
    const faqCards = document.querySelectorAll("#faqAccordionList .faq-card");

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            const filter = chip.getAttribute("data-faq-filter");

            faqCards.forEach((card, index) => {
                const cat = card.getAttribute("data-faq-cat");
                if (filter === "all" || cat === filter) {
                    card.classList.remove("faq-hidden");
                    card.style.animation = "none";
                    void card.offsetHeight; // trigger reflow
                    card.style.animation = `srvCardAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.04}s backwards`;
                } else {
                    card.classList.add("faq-hidden");
                }
            });
        });
    });
}

// 13. Services Showcase Category Filtering & Interactive Dynamic Spotlight
function initServicesShowcase() {
    const filterButtons = document.querySelectorAll("#servicesFilterNav .srv-filter-btn");
    const serviceCards = document.querySelectorAll("#servicesCardsGrid .service-card");

    // Category Filter Switching
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-srv-filter");
            serviceCards.forEach(card => {
                const category = card.getAttribute("data-srv-cat");
                if (filter === "all" || category === filter) {
                    card.classList.remove("srv-hidden");
                    card.style.animation = "none";
                    void card.offsetHeight; // trigger reflow
                    card.style.animation = "srvCardAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards";
                } else {
                    card.classList.add("srv-hidden");
                }
            });
        });
    });

    // Dynamic Mouse Spotlight Effect on Service Cards
    serviceCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
}

// 14. Bento Review Carousel Logic
const bentoReviewsData = [
    {
        quote: "They handled my Germany Schengen visa & Umrah package smoothly and cost-effectively—highly recommend Rolex Travels!",
        name: "Prashant Chothani",
        tag: "Verified Explorer (Dubai)",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
    },
    {
        quote: "Rolex Travels arranged our Switzerland family holiday including rail passes and hotels seamlessly. 5-star service throughout!",
        name: "Sarah Jenkins",
        tag: "Holiday Maker (UK)",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
    },
    {
        quote: "Our company recruited 80+ technical staff through Rolex Travels. Document attestation and flight ticketing were flawless.",
        name: "Ahmed Al-Mansoor",
        tag: "Corporate Client (Saudi Arabia)",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    }
];

let currentBentoReviewIdx = 0;

function updateBentoReview(index) {
    const quoteEl = document.getElementById("bentoReviewQuote");
    const nameEl = document.getElementById("bentoAuthorName");
    const tagEl = document.getElementById("bentoAuthorTag");
    const imgEl = document.getElementById("bentoAuthorImg");

    if (!quoteEl || !nameEl || !tagEl || !imgEl) return;

    const data = bentoReviewsData[index];
    quoteEl.style.opacity = "0";
    setTimeout(() => {
        quoteEl.textContent = `"${data.quote}"`;
        nameEl.textContent = data.name;
        tagEl.textContent = data.tag;
        imgEl.src = data.img;
        quoteEl.style.opacity = "1";
    }, 150);
}

function nextBentoReview() {
    currentBentoReviewIdx = (currentBentoReviewIdx + 1) % bentoReviewsData.length;
    updateBentoReview(currentBentoReviewIdx);
}

function prevBentoReview() {
    currentBentoReviewIdx = (currentBentoReviewIdx - 1 + bentoReviewsData.length) % bentoReviewsData.length;
    updateBentoReview(currentBentoReviewIdx);
}