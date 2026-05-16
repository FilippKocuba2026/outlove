// OutLove - Modular App Logic (dev branch)
// Шаг 2: Свайп-карточки + лайки/матчи

console.log('%c[OutLove] Modular version with Swipes loaded', 'color:#22c55e');

// === Глобальные данные ===
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    name: "Ты", age: 28, city: "Москва", gender: "Мужской",
    avatar: "https://picsum.photos/id/64/32/32", incognito: false
};

let likes = JSON.parse(localStorage.getItem('likes')) || [];
let matches = JSON.parse(localStorage.getItem('matches')) || [];
let currentSwipeIndex = 0;
let filteredUsers = [];
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};
let currentChatUser = null;
let aiConversation = JSON.parse(localStorage.getItem('aiConversation')) || [];

// Тестовые пользователи для свайпов
let fakeUsers = [
    { id: 1, name: "Анна Морозова", age: 26, city: "Москва", distance: 3, photo: "https://picsum.photos/id/64/400/500", bio: "Люблю путешествия, кофе и хорошие разговоры", interests: ["путешествия", "фотография", "йога"], zodiac: "Лев", online: true },
    { id: 2, name: "Дмитрий Соколов", age: 29, city: "Санкт-Петербург", distance: 12, photo: "https://picsum.photos/id/65/400/500", bio: "Программист, гитарист", interests: ["музыка", "программирование"], zodiac: "Скорпион", online: false },
    { id: 3, name: "София Волкова", age: 24, city: "Москва", distance: 7, photo: "https://picsum.photos/id/66/400/500", bio: "Художница. Ищу вдохновение", interests: ["искuсство", "кино"], zodiac: "Рыбы", online: true }
];

function saveData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('matches', JSON.stringify(matches));
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
}

function updateProfileUI() {
    const avatar = document.getElementById('profile-avatar');
    if (avatar) avatar.src = currentUser.avatar || 'https://picsum.photos/id/64/32/32';
}

// === Вход и регистрация ===
function simulateLogin() { /* ... оставляем как было ... */ }
function showRegistrationForm() { /* ... */ }
function completeRegistration() { /* ... */ }

// === Переключение вкладок ===
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('nav-active'));
    const active = document.querySelector(`[data-tab="${tab}"]`);
    if (active) active.classList.add('nav-active');
    renderContent(tab);
}

function renderContent(tab) {
    const container = document.getElementById('main-content');
    if (!container) return;
    container.innerHTML = '';

    if (tab === 'feed') {
        container.innerHTML = `<div class="px-5 pt-4"><h2 class="text-2xl font-semibold mb-4">Лента</h2><div class="glass rounded-3xl p-5">...</div></div>`;
    } 
    else if (tab === 'search') {
        container.innerHTML = `
            <div class="px-5 pt-6">
                <div class="flex justify-between items-center mb-4">
                    <button onclick="sortByCompatibility()" class="px-3.5 py-1.5 bg-white/10 rounded-2xl text-xs flex items-center gap-1.5">
                        <i class="fa-solid fa-robot text-purple-400"></i> <span>AI-Поиск</span>
                    </button>
                </div>
                <div id="swipe-container" class="relative h-[460px] flex justify-center mt-4"></div>
                
                <div class="flex justify-center gap-8 mt-6">
                    <button onclick="passUser()" class="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-3xl">
                        <i class="fa-solid fa-times"></i>
                    </button>
                    <button onclick="likeUser()" class="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-3xl text-white">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>`;
        setTimeout(() => renderSwipeCards(), 100);
    } 
    else if (tab === 'messages') {
        container.innerHTML = `<div class="px-5 pt-6"><h2 class="text-2xl font-semibold mb-4">Чаты</h2></div>`;
    }
}

// === Свайп-карточки ===
function renderSwipeCards() {
    const container = document.getElementById('swipe-container');
    if (!container) return;
    container.innerHTML = '';

    if (currentSwipeIndex >= fakeUsers.length) currentSwipeIndex = 0;
    const user = fakeUsers[currentSwipeIndex];
    if (!user) return;

    const card = document.createElement('div');
    card.className = `swipe-card absolute w-full max-w-[340px] bg-[#12121a] rounded-3xl overflow-hidden cursor-grab`;
    card.innerHTML = `
        <div class="relative h-[420px]">
            <img src="${user.photo}" class="w-full h-full object-cover">
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 h-2/3"></div>
            <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div class="flex items-end justify-between">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-3xl font-bold">${user.name}</span>
                            <span class="text-2xl text-white/80">${user.age}</span>
                        </div>
                        <div class="text-sm text-white/70">${user.city} • ${user.distance} км</div>
                    </div>
                </div>
                <div class="mt-3 text-sm text-white/80">${user.bio}</div>
            </div>
        </div>
    `;

    // Простая свайп-логика
    let startX = 0;
    card.addEventListener('mousedown', e => startX = e.clientX);
    card.addEventListener('mouseup', e => {
        const diff = e.clientX - startX;
        if (diff > 80) likeUser();
        else if (diff < -80) passUser();
        else renderSwipeCards();
    });

    container.appendChild(card);
}

function likeUser() {
    const user = fakeUsers[currentSwipeIndex];
    if (!user) return;

    if (!likes.includes(user.id)) likes.push(user.id);

    if (Math.random() < 0.45 && !matches.find(m => m.id === user.id)) {
        matches.push(user);
        showMatchPopup(user);
    } else {
        showToast(`❤️ Ты лайкнул(а) ${user.name}`);
        nextSwipeCard();
    }
    saveData();
}

function passUser() {
    showToast('Пропущено');
    nextSwipeCard();
}

function nextSwipeCard() {
    currentSwipeIndex = (currentSwipeIndex + 1) % fakeUsers.length;
    renderSwipeCards();
}

function showMatchPopup(user) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[100000]';
    popup.innerHTML = `
        <div class="text-center px-6">
            <div class="text-7xl mb-4">🎉</div>
            <h2 class="text-4xl font-bold mb-2">Это матч!</h2>
            <p class="text-xl text-zinc-300">Вы понравились друг другу</p>
            
            <div class="flex justify-center gap-4 my-8">
                <img src="${currentUser.avatar}" class="w-24 h-24 rounded-3xl ring-4 ring-purple-500">
                <img src="${user.photo}" class="w-24 h-24 rounded-3xl ring-4 ring-pink-500">
            </div>

            <div class="flex gap-4 justify-center">
                <button onclick="startChat(${user.id}); this.closest('.fixed').remove()" 
                        class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold">
                    Написать
                </button>
                <button onclick="this.closest('.fixed').remove(); nextSwipeCard()" 
                        class="px-8 py-4 border border-white/30 rounded-2xl font-semibold">
                    Продолжить
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#1f1f2b;color:white;padding:14px 24px;border-radius:9999px;z-index:99999;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
}

function startChat(userId) {
    alert('Чат будет добавлен на следующем шаге');
}

function sortByCompatibility() {
    showToast('AI подобрал лучших для тебя!');
}

window.onload = () => {
    updateProfileUI();
};