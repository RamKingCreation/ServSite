// ==============================================
// CUSTOMER MODULE CONTROLLER LOGIC
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. AUTHENTICATION & LOGIN FLOW ---
    const authOverlay = document.getElementById("authOverlay");
    const loginStep1Form = document.getElementById("loginStep1Form");
    const loginStep2Form = document.getElementById("loginStep2Form");
    const authPhone = document.getElementById("authPhone");
    const authOtp = document.getElementById("authOtp");
    const displayPhone = document.getElementById("displayPhone");
    const changePhone = document.getElementById("changePhone");
    const topUserName = document.getElementById("topUserName");
    const sidebarUserName = document.getElementById("sidebarUserName");
    const sidebarUserPhone = document.getElementById("sidebarUserPhone");

    let savedPhoneNum = "";

    // Step 1: Request OTP
    if(loginStep1Form) {
        loginStep1Form.addEventListener("submit", (e) => {
            e.preventDefault();
            savedPhoneNum = authPhone.value.trim();
            if(savedPhoneNum.length !== 10) {
                alert("Please enter a valid 10-digit mobile number.");
                return;
            }
            displayPhone.innerText = `+91 ${savedPhoneNum}`;
            loginStep1Form.style.display = "none";
            loginStep2Form.style.display = "block";
            alert("Demo OTP sent: 123456");
        });
    }

    // Change Phone Link
    if(changePhone) {
        changePhone.addEventListener("click", (e) => {
            e.preventDefault();
            loginStep2Form.style.display = "none";
            loginStep1Form.style.display = "block";
        });
    }

    // Step 2: Verify OTP
    if(loginStep2Form) {
        loginStep2Form.addEventListener("submit", (e) => {
            e.preventDefault();
            const otpVal = authOtp.value.trim();
            if(otpVal !== "123456") {
                alert("Invalid OTP! Please enter 123456");
                return;
            }
            // Success Login
            authOverlay.classList.remove("active");
            if(sidebarUserPhone) sidebarUserPhone.innerText = `+91 ${savedPhoneNum}`;
            alert("Login successful!");
        });
    }

    // Logout Handler
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if(confirm("Are you sure you want to logout?")) {
                authOverlay.classList.add("active");
                loginStep2Form.style.display = "none";
                loginStep1Form.style.display = "block";
                authPhone.value = "";
                authOtp.value = "";
            }
        });
    }

    // --- 2. SIDEBAR NAVIGATION SWITCHER ---
    const menuLinks = document.querySelectorAll(".sidebar-menu .menu-link");
    const dashSections = document.querySelectorAll(".dash-section");
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");

            menuLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            dashSections.forEach(sec => {
                sec.classList.remove("active");
                if(sec.id === targetId) {
                    sec.classList.add("active");
                }
            });

            // Mobile view me sidebar auto-close ho jaye
            if(window.innerWidth <= 991) {
                sidebar.classList.remove("active");
            }
        });
    });

    if(menuToggle) {
        menuToggle.addEventListener("click", () => sidebar.classList.add("active"));
    }
    if(sidebarClose) {
        sidebarClose.addEventListener("click", () => sidebar.classList.remove("active"));
    }

    // --- 3. GPS GEOLOCATION & LOCATION DETECTING ---
    const currentLocText = document.getElementById("currentLocText");
    const refreshLocBtn = document.getElementById("refreshLocBtn");

    function fetchUserLocation() {
        currentLocText.innerText = "Detecting GPS location...";
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    if(data && data.display_name) {
                        currentLocText.innerText = data.display_name.split(",")[0] + ", " + (data.display_name.split(",")[1] || "");
                    } else {
                        currentLocText.innerText = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
                    }
                } catch(err) {
                    currentLocText.innerText = "Muzaffarpur, Bihar";
                }
            }, () => {
                currentLocText.innerText = "Muzaffarpur, Bihar (Default)";
            }, { timeout: 7000 });
        } else {
            currentLocText.innerText = "Muzaffarpur, Bihar";
        }
    }

    fetchUserLocation();
    if(refreshLocBtn) {
        refreshLocBtn.addEventListener("click", fetchUserLocation);
    }

    // --- 4. ADVANCED BOOKING MODAL & FLOW ---
    const customerBookingModal = document.getElementById("customerBookingModal");
    const closeCustModal = document.getElementById("closeCustModal");
    const modalServiceTitle = document.getElementById("modalServiceTitle");
    const modalServicePrice = document.getElementById("modalServicePrice");
    const bookTriggerBtns = document.querySelectorAll(".book-trigger-btn");
    const customerBookingForm = document.getElementById("customerBookingForm");
    const custBookLocation = document.getElementById("custBookLocation");
    const custGpsBtn = document.getElementById("custGpsBtn");

    bookTriggerBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".service-card-item");
            const sName = card.querySelector("h3").innerText;
            const sPrice = card.getAttribute("data-price");

            modalServiceTitle.innerText = `Book ${sName}`;
            modalServicePrice.innerText = `Estimated Charges: ${sPrice}`;
            customerBookingModal.classList.add("active");
        });
    });

    if(closeCustModal) {
        closeCustModal.addEventListener("click", () => customerBookingModal.classList.remove("active"));
    }

    // GPS in Modal
    if(custGpsBtn && custBookLocation) {
        custGpsBtn.addEventListener("click", () => {
            custBookLocation.value = "Fetching current GPS...";
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    custBookLocation.value = data.display_name || `Lat:${lat}, Lon:${lon}`;
                } catch(e) {
                    custBookLocation.value = "Muzaffarpur, Bihar";
                }
            }, () => {
                custBookLocation.value = "Muzaffarpur, Bihar";
            });
        });
    }

    // Form Submit Booking Request
    if(customerBookingForm) {
        customerBookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Booking confirmed successfully! ServSite is broadcasting your request to nearby available service providers.");
            customerBookingModal.classList.remove("active");
            customerBookingForm.reset();
        });
    }

    // --- 5. LIVE CHAT & CALL SIMULATOR ---
    const callProviderBtn = document.getElementById("callProviderBtn");
    const chatProviderBtn = document.getElementById("chatProviderBtn");
    const chatModal = document.getElementById("chatModal");
    const closeChatModal = document.getElementById("closeChatModal");
    const chatMessages = document.getElementById("chatMessages");
    const chatInputMsg = document.getElementById("chatInputMsg");
    const sendChatBtn = document.getElementById("sendChatBtn");

    if(callProviderBtn) {
        callProviderBtn.addEventListener("click", () => {
            alert("Connecting call to provider Amit Sharma (+91 9811223344)...");
        });
    }

    if(chatProviderBtn && chatModal) {
        chatProviderBtn.addEventListener("click", () => chatModal.classList.add("active"));
    }
    if(closeChatModal) {
        closeChatModal.addEventListener("click", () => chatModal.classList.remove("active"));
    }

    if(sendChatBtn && chatInputMsg) {
        sendChatBtn.addEventListener("click", () => {
            const txt = chatInputMsg.value.trim();
            if(!txt) return;

            const userDiv = document.createElement("div");
            userDiv.className = "chat-msg user";
            userDiv.innerText = txt;
            chatMessages.appendChild(userDiv);
            chatInputMsg.value = "";
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                const provDiv = document.createElement("div");
                provDiv.className = "chat-msg provider";
                provDiv.innerText = "Theek hai sir, main samajh gaya.";
                chatMessages.appendChild(provDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        });
    }

    // --- 6. LIVE SEARCH FOR SERVICES ---
    const customerSearchInput = document.getElementById("customerSearchInput");
    const serviceCardItems = document.querySelectorAll(".service-card-item");

    if(customerSearchInput) {
        customerSearchInput.addEventListener("input", () => {
            const query = customerSearchInput.value.toLowerCase().trim();
            serviceCardItems.forEach(card => {
                const title = card.querySelector("h3").innerText.toLowerCase();
                const desc = card.querySelector("p").innerText.toLowerCase();
                if(title.includes(query) || desc.includes(query)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // Profile Update Form
    const profileUpdateForm = document.getElementById("profileUpdateForm");
    if(profileUpdateForm) {
        profileUpdateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newName = document.getElementById("profName").value;
            if(topUserName) topUserName.innerText = newName.split(" ")[0];
            if(sidebarUserName) sidebarUserName.innerText = newName;
            alert("Profile updated successfully!");
        });
    }

    // Support Form Ticket
    const supportForm = document.getElementById("supportForm");
    if(supportForm) {
        supportForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Support ticket submitted successfully! Our team will reach out within 24 hours.");
            supportForm.reset();
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    
    // --- CHECK CURRENT LOGGED IN USER ---
    const currentUser = JSON.parse(localStorage.getItem("servsite_current_user"));

    if(!currentUser) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    // --- POPULATE USER DETAILS ACROSS DASHBOARD ---
    const topUserName = document.getElementById("topUserName");
    const sidebarUserName = document.getElementById("sidebarUserName");
    const sidebarUserEmail = document.getElementById("sidebarUserEmail");
    const sidebarUserImg = document.getElementById("sidebarUserImg");
    const topUserImg = document.getElementById("topUserImg");
    
    const profileNameDisplay = document.getElementById("profileNameDisplay");
    const profileEmailDisplay = document.getElementById("profileEmailDisplay");
    const profileImgDisplay = document.getElementById("profileImgDisplay");
    
    const profName = document.getElementById("profName");
    const profEmail = document.getElementById("profEmail");
    const profPhone = document.getElementById("profPhone");

    // Display values
    if(topUserName) topUserName.innerText = currentUser.name;
    if(sidebarUserName) sidebarUserName.innerText = currentUser.name;
    if(sidebarUserEmail) sidebarUserEmail.innerText = currentUser.email;
    if(profileNameDisplay) profileNameDisplay.innerText = currentUser.name;
    if(profileEmailDisplay) profileEmailDisplay.innerText = currentUser.email;

    if(profName) profName.value = currentUser.name;
    if(profEmail) profEmail.value = currentUser.email;
    if(profPhone) profPhone.value = currentUser.phone || "";

    if(currentUser.profileImg) {
        if(sidebarUserImg) sidebarUserImg.src = currentUser.profileImg;
        if(topUserImg) topUserImg.src = currentUser.profileImg;
        if(profileImgDisplay) profileImgDisplay.src = currentUser.profileImg;
    }

    // --- LOGOUT HANDLER ---
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("servsite_current_user");
            window.location.href = "login.html";
        });
    }

    // --- PROFILE UPDATE & IMAGE CHANGE ---
    const profileUpdateForm = document.getElementById("profileUpdateForm");
    const profileImageInput = document.getElementById("profileImageInput");

    if(profileUpdateForm) {
        profileUpdateForm.addEventListener("submit", (e) => {
            e.preventDefault();

            currentUser.name = profName.value;
            currentUser.email = profEmail.value;
            currentUser.phone = profPhone.value;

            if(profileImageInput && profileImageInput.files && profileImageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentUser.profileImg = event.target.result;
                    localStorage.setItem("servsite_current_user", JSON.stringify(currentUser));
                    
                    // Update in main users array too
                    let users = JSON.parse(localStorage.getItem("servsite_users")) || [];
                    users = users.map(u => u.email === currentUser.email ? currentUser : u);
                    localStorage.setItem("servsite_users", JSON.stringify(users));

                    alert("Profile updated successfully!");
                    location.reload();
                };
                reader.readAsDataURL(profileImageInput.files[0]);
            } else {
                localStorage.setItem("servsite_current_user", JSON.stringify(currentUser));
                let users = JSON.parse(localStorage.getItem("servsite_users")) || [];
                users = users.map(u => u.email === currentUser.email ? currentUser : u);
                localStorage.setItem("servsite_users", JSON.stringify(users));

                alert("Profile updated successfully!");
                location.reload();
            }
        });
    }

    // --- SIDEBAR SWITCHER ---
    const menuLinks = document.querySelectorAll(".sidebar-menu .menu-link");
    const dashSections = document.querySelectorAll(".dash-section");
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            menuLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
            dashSections.forEach(sec => {
                sec.classList.remove("active");
                if(sec.id === targetId) sec.classList.add("active");
            });
            if(window.innerWidth <= 991) sidebar.classList.remove("active");
        });
    });

    if(menuToggle) menuToggle.addEventListener("click", () => sidebar.classList.add("active"));
    if(sidebarClose) sidebarClose.addEventListener("click", () => sidebar.classList.remove("active"));

    // --- BOOKING MODAL POPUP ---
    const customerBookingModal = document.getElementById("customerBookingModal");
    const closeCustModal = document.getElementById("closeCustModal");
    const modalServiceTitle = document.getElementById("modalServiceTitle");
    const modalServicePrice = document.getElementById("modalServicePrice");
    const bookTriggerBtns = document.querySelectorAll(".book-trigger-btn");

    bookTriggerBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".service-card-item");
            modalServiceTitle.innerText = `Book ${card.querySelector("h3").innerText}`;
            modalServicePrice.innerText = `Estimated Charges: ${card.getAttribute("data-price")}`;
            customerBookingModal.classList.add("active");
        });
    });

    if(closeCustModal) closeCustModal.addEventListener("click", () => customerBookingModal.classList.remove("active"));
});