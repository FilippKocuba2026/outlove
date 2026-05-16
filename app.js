// OutLove - Modular App Logic (dev branch)
console.log('%c[OutLove] Modular version loaded', 'color:#22c55e');

// === Глобальные данные ===
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    name: "Ты",
    age: 28,
    city: "Москва",
    gender: "Мужской",
    avatar: "https://picsum.photos/id/64/32/32",
    incognito: false
};

let likes = JSON.parse(localStorage.getItem('likes')) || [];
let matches = JSON.parse(localStorage.getItem('matches')) || [];
let currentSwipeIndex = 0;
let filteredUsers = [];
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};
let currentChatUser = null;
let aiConversation = JSON.parse(localStorage.getItem('aiConversation')) || [];

// === Сохранение ===
function saveData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('matches', JSON.stringify(matches));
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    localStorage.setItem('aiConversation', JSON.stringify(aiConversation));
}

function updateProfileUI() {
    const avatar = document.getElementById('profile-avatar');
    if (avatar) avatar.src = currentUser.avatar || 'https://picsum.photos/id/64/32/32';
}

// === Вход ===
function simulateLogin() {
    const auth = document.getElementById('auth-screen');
    if (!auth) return;
    
    auth.innerHTML = `<div class="flex flex-col items-center justify-center min-h-screen"><div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div><p class="mt-4 text-lg">Входим...</p></div>`;
    
    setTimeout(() => {
        auth.style.display = 'none';
        document.getElementById('main-app').classList.remove('hidden');
        updateProfileUI();
        switchTab('feed');
    }, 800);
}

function showRegistrationForm() {
    const auth = document.getElementById('auth-screen');
    if (!auth) return;
    auth.innerHTML = `<div class="px-6 py-8"><div class="flex items-center gap-x-3 mb-8"><button onclick="location.reload()" class="text-2xl">←</button><div class="font-semibold text-xl">Регистрация</div></div><div class="space-y-4"><input id="reg-name" placeholder="ФИО" class="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-sm"><input id="reg-age" type="number" placeholder="Возраст" class="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-sm"><input id="reg-city" placeholder="Город" class="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3.5 text-sm"><button onclick="completeRegistration()" class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold mt-6">Создать аккаунт</button></div></div>`;
}

function completeRegistration() {
    const name = document.getElementById('reg-name')?.value.trim();
    const age = document.getElementById('reg-age')?.value;
    const city = document.getElementById('reg-city')?.value.trim();
    
    if (!name || !age || !city) {
        alert('Заполни все поля');
        return;
    }
    currentUser.name = name;
    currentUser.age = parseInt(age);
    currentUser.city = city;
    saveData();
    
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-app').classList.remove('hidden');
    updateProfileUI();
    switchTab('feed');
}

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
        container.innerHTML = `
            <div class="px-5 pt-4">
                <h2 class="text-2xl font-semibold mb-4">Лента</h2>
                <div class="glass rounded-3xl p-5 mb-4">
                    <div class="flex items-center gap-3 mb-3">
                        <img src="${currentUser.avatar}" class="w-10 h-10 rounded-full">
                        <div>
                            <div class="font-medium">${currentUser.name}</div>
                            <div class="text-xs text-zinc-400">только что</div>
                        </div>
                    </div>
                    <div class="text-sm">Сегодня встретил(а) потрясающего человека! ❤️</div>
                </div>
            </div>`;
    } else if (tab === 'search') {
        container.innerHTML = `<div class="px-5 pt-6"><h2 class="text-2xl font-semibold mb-4">Поиск</h2><p class="text-zinc-400">Свайп-карточки будут добавлены на следующем шаге.</p></div>`;
    } else if (tab === 'messages') {
        container.innerHTML = `<div class="px-5 pt-6"><h2 class="text-2xl font-semibold mb-4">Чаты</h2><p class="text-zinc-400">Матчи появятся здесь после свайпов.</p></div>`;
    } else if (tab === 'music') {
        container.innerHTML = `<div class="px-5 pt-8"><h2 class="text-2xl font-semibold mb-6">Музыка</h2><div class="glass rounded-3xl p-8 text-center py-16"><i class="fa-solid fa-music text-7xl text-purple-400 mb-6"></i><h3 class="text-xl font-semibold">Здесь будет твоя музыка</h3></div></div>`;
    }
}

// === Боковое меню (заглушка) ===
function openSideMenu() {
    alert('Боковое меню будет доработано на следующем шаге');
}

function showNotifications() {
    alert('Уведомления (demo)');
}

// === Инициализация ===
window.onload = () => {
    updateProfileUI();
    console.log('%c[OutLove] App initialized on dev branch', 'color:#a855f7');
};