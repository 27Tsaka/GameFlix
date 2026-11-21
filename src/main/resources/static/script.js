
document.addEventListener("DOMContentLoaded", () => {

    // GAMEFLIX AUTHENTICATION

    const modal = document.getElementById("authModal");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const closeModal = document.getElementById("closeModal");

    const authForm = document.getElementById("authForm");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const submitBtn = document.getElementById("submitBtn");
    const authMessage = document.getElementById("authMessage");

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    let currentMode = "login";

    // OPEN LOGIN OR SIGN UP

    function openAuthModal(mode) {
        currentMode = mode;

        authForm.reset();
        authMessage.textContent = "";
        authMessage.className = "";

        if (mode === "register") {
            modalTitle.textContent = "Create Your Account";
            modalSubtitle.textContent =
                "Join GameFlix and start your gaming journey.";
            submitBtn.textContent = "Sign Up";
            passwordInput.autocomplete = "new-password";
        } else {
            modalTitle.textContent = "Welcome Back";
            modalSubtitle.textContent =
                "Log in to your GameFlix account.";
            submitBtn.textContent = "Login";
            passwordInput.autocomplete = "current-password";
        }

        modal.classList.remove("hidden");
        usernameInput.focus();
    }

    loginBtn.addEventListener("click", () => {
        openAuthModal("login");
    });

    registerBtn.addEventListener("click", () => {
        openAuthModal("register");
    });

    // CLOSE AUTHENTICATION POPUP

    function hideModal() {
        modal.classList.add("hidden");
        authForm.reset();
        authMessage.textContent = "";
    }

    closeModal.addEventListener("click", hideModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // DISPLAY AUTHENTICATION MESSAGES

    function showMessage(message, success) {
        authMessage.textContent = message;
        authMessage.className = success ? "success" : "error";
    }

    // CONNECT LOGIN AND SIGN UP TO SPRING BOOT

    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            showMessage(
                "Please enter a username and password.",
                false
            );
            return;
        }

        const mode = currentMode;
        const endpoint = mode === "register"
            ? "/register"
            : "/login";

        submitBtn.disabled = true;
        submitBtn.textContent = "Please wait...";

        authMessage.textContent = "";
        authMessage.className = "";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const responseText = await response.text();

            let result;

            try {
                result = JSON.parse(responseText);
            } catch (error) {
                result = responseText;
            }

            let message;

            if (typeof result === "object" && result !== null) {
                message = result.message ||
                    result.error ||
                    "Request completed.";
            } else {
                message = String(result);
            }

            const success =
                response.ok &&
                (
                    message === "User registered successfully" ||
                    message === "Login successful"
                );

            showMessage(message, success);

            if (success) {
                passwordInput.value = "";
            }

        } catch (error) {
            showMessage(
                "Unable to connect to GameFlix. Make sure Spring Boot is running.",
                false
            );

            console.error("GameFlix request failed:", error);

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent =
                mode === "register" ? "Sign Up" : "Login";
        }
    });

    // GAME INFORMATION

    const games = {
        "Shadow Legends": {
            genre: "Action",
            icon: "⚔️",
            description:
                "Enter a world filled with powerful warriors, dangerous enemies, and exciting adventures. Shadow Legends is a sample action game focused on intense battles and exploration.",
            features: [
                "Action-packed battles",
                "Powerful characters",
                "Fantasy environments",
                "Adventure challenges"
            ]
        },

        "Velocity Rush": {
            genre: "Racing",
            icon: "🏎️",
            description:
                "Experience high-speed racing challenges and competitive tracks. Velocity Rush is a sample racing game designed around speed, competition, and exciting driving experiences.",
            features: [
                "High-speed racing",
                "Competitive challenges",
                "Exciting race tracks",
                "Driving adventures"
            ]
        },

        "Galaxy Explorer": {
            genre: "Adventure",
            icon: "🚀",
            description:
                "Travel across space and discover mysterious planets and new worlds. Galaxy Explorer is a sample adventure game centered on exploration and exciting discoveries.",
            features: [
                "Space exploration",
                "Mysterious planets",
                "New worlds to discover",
                "Adventure missions"
            ]
        }
    };

    // GAME DETAILS POPUP
    // Uses the existing HTML popup in index.html

    const gameModal = document.getElementById("gameModal");
    const gameTitle = document.getElementById("gameModalTitle");
    const gameGenre = document.getElementById("gameModalCategory");
    const gameDescription =
        document.getElementById("gameModalDescription");
    const gameFeatures =
        document.getElementById("gameModalHighlights");
    const closeGameDetails =
        document.getElementById("closeGameModal");

    function openGameDetails(gameName) {
        const game = games[gameName];

        if (!game || !gameModal) {
            console.warn("Game details unavailable:", gameName);
            return;
        }

        gameTitle.textContent = game.icon + " " + gameName;
        gameGenre.textContent = game.genre.toUpperCase();
        gameDescription.textContent = game.description;

        gameFeatures.replaceChildren();

        game.features.forEach((feature) => {
            const item = document.createElement("li");
            item.textContent = feature;
            gameFeatures.appendChild(item);
        });

        gameModal.classList.remove("hidden");
        closeGameDetails.focus();
    }

    // CLOSE GAME DETAILS

    function hideGameDetails() {
        if (gameModal) {
            gameModal.classList.add("hidden");
        }
    }

    if (closeGameDetails) {
        closeGameDetails.addEventListener(
            "click",
            hideGameDetails
        );
    }

    if (gameModal) {
        gameModal.addEventListener("click", (event) => {
            if (event.target === gameModal) {
                hideGameDetails();
            }
        });
    }

    // CONNECT ALL VIEW DETAILS BUTTONS

    document.querySelectorAll(".game-details").forEach(
        (button) => {
            button.addEventListener("click", () => {
                const gameName = button.dataset.game;
                openGameDetails(gameName);
            });
        }
    );

    // ESCAPE KEY CLOSES POPUPS

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (gameModal &&
            !gameModal.classList.contains("hidden")) {
            hideGameDetails();
        } else if (!modal.classList.contains("hidden")) {
            hideModal();
        }
    });

});
