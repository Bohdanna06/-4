window.addEventListener("load", function () {
    const ad = document.getElementById("fullscreenAd");
    const closeBtn = document.getElementById("closeAd");

    // Показуємо рекламу через 3 секунди
    setTimeout(() => {
        ad.classList.remove("hidden");

        // Показуємо хрестик ще через 5 секунд
        setTimeout(() => {
            closeBtn.classList.remove("hidden");
        }, 2000);
    }, 8000);

    // Закриття реклами
    closeBtn.addEventListener("click", () => {
        ad.style.display = "none";
    });
});


