function showSubscriptionWindowOnceOnScroll() {
    window.addEventListener('scroll', function onscroll() {

        if (window.scrollY > 50) {
            document.getElementById('subscriptionWindow').style.display = 'block';
            window.removeEventListener('scroll', arguments.callee);
        }
    });
}
if (!sessionStorage.getItem('subscribed')) {
    showSubscriptionWindowOnceOnScroll();
}


// Обробка подій для кнопок
document.getElementById('acceptBtn').addEventListener('click', () => {
    sessionStorage.setItem('subscribed', 'true');
    document.getElementById('subscriptionWindow').style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'block';
    setTimeout(() => {
        document.getElementById('thankYouMessage').style.display = 'none';
    }, 3000); // Приховати повідомлення через 3 секунди
});

document.getElementById('declineBtn').addEventListener('click', () => {
    document.getElementById('subscriptionWindow').style.display = 'none';
    showSubscriptionWindowOnceOnScroll();
});

