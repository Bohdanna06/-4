const newsList = document.querySelector('.js-news-list');

const newsData = [
    { id: 1, title: 'Знижки на каву!', content: 'Сьогодні у нас знижки на всі види кави!', date: '2025-05-06 14:30', important: true },
    { id: 2, title: 'Новий сорт арабіки', content: 'Ми додали новий сорт – спробуйте!', date: '2025-05-06 12:15', important: false },
    { id: 3, title: 'Безкоштовна доставка', content: 'Протягом цього тижня доставка безкоштовна!', date: '2025-05-05 10:00', important: false },
    { id: 4, title: 'Знижки на каву!', content: 'Сьогодні у нас знижки на всі види кави!', date: '2025-05-06 14:30', important: false },
    { id: 5, title: 'Новий сорт арабіки', content: 'Ми додали новий сорт – спробуйте!', date: '2025-05-06 12:15', important: false },
    { id: 6, title: 'Безкоштовна доставка', content: 'Протягом цього тижня доставка безкоштовна!', date: '2025-05-05 10:00', important: false },
    { id: 7, title: 'Знижки на каву!', content: 'Сьогодні у нас знижки на всі види кави!', date: '2025-05-06 14:30', important: false },
    { id: 8, title: 'Новий сорт арабіки', content: 'Ми додали новий сорт – спробуйте!', date: '2025-05-06 12:15', important: false },
    { id: 9, title: 'Безкоштовна доставка', content: 'Протягом цього тижня доставка безкоштовна!', date: '2025-05-05 10:00', important: false },
    { id: 10, title: 'Знижки на каву!', content: 'Сьогодні у нас знижки на всі види кави!', date: '2025-05-06 14:30', important: false },
    { id: 11, title: 'Новий сорт арабіки', content: 'Ми додали новий сорт – спробуйте!', date: '2025-05-06 12:15', important: false },
    { id: 12, title: 'Безкоштовна доставка', content: 'Протягом цього тижня доставка безкоштовна!', date: '2025-05-05 10:00', important: false }
];

newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

function renderNewsList() {
    newsList.innerHTML = '';

    newsData.forEach(news => {
        const li = document.createElement('li');
        li.className = 'news-item';
        if (news.important) li.classList.add('important');

        li.innerHTML = `
            <div class="news-title">${news.title}  ${news.date}</div>
            <div class="news-content">${news.content}</div>
        `;

        li.querySelector('.news-title').addEventListener('click', () => {
            const isActive = li.classList.contains('active');
            document.querySelectorAll('.news-item').forEach(item => item.classList.remove('active'));
            if (!isActive) {
                li.classList.add('active');
            }
        });

        newsList.appendChild(li);
    });
}

renderNewsList();
