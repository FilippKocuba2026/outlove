// OutLove - Modular App Logic (dev branch)
// Шаг 3: Чат + AI Love Coach

console.log('%c[OutLove] Chat + AI Coach loaded', 'color:#22c55e');

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: "Ты", age: 28, city: "Москва", avatar: "https://picsum.photos/id/64/32/32" };
let likes = JSON.parse(localStorage.getItem('likes')) || [];
let matches = JSON.parse(localStorage.getItem('matches')) || [];
let currentSwipeIndex = 0;
let fakeUsers = [
    { id: 1, name: "Анна Морозова", age: 26, city: "Москва", distance: 3, photo: "https://picsum.photos/id/64/400/500", bio: "Люблю путешествия и кофе", interests: ["путешествия"], zodiac: "Лев", online: true },
    { id: 2, name: "Дмитрий Соколов", age: 29, city: "Спб", distance: 12, photo: "https://picsum.photos/id/65/400/500", bio: "Программист и гитарист", interests: ["музыка"], zodiac: "Скорпион", online: false }
];
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};
let currentChatUser = null;
let aiConversation = JSON.parse(localStorage.getItem('aiConversation')) || [];

function saveData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('matches', JSON.stringify(matches));
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    localStorage.setItem('aiConversation', JSON.stringify(aiConversation));
}

function updateProfileUI() {
    const avatar = document.getElementById('profile-avatar');
    if (avatar) avatar.src = currentUser.avatar;
}

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
        container.innerHTML = `<div class="px-5 pt-4"><h2 class="text-2xl font-semibold mb-4">Лента</h2></div>`;
    } else if (tab === 'search') {
        container.innerHTML = `<div class="px-5 pt-6"><div id="swipe-container" class="relative h-[460px]"></div></div>`;
        setTimeout(() => renderSwipeCards(), 100);
    } else if (tab === 'messages') {
        renderMessagesList(container);
    }
}

// === ЧАТ ===
function renderMessagesList(container) {
    if (matches.length === 0) {
        container.innerHTML = `<div class="px-5 pt-8 text-center"><i class="fa-solid fa-comments text-6xl text-zinc-700 mb-4"></i><h3 class="text-xl">Пока нет матчей</h3></div>`;
        return;
    }
    let html = `<div class="px-5 pt-6"><h2 class="text-2xl font-semibold mb-4">Чаты</h2>`;
    matches.forEach(u => {
        html += `<div onclick="startChat(${u.id})" class="glass p-4 mb-3 flex gap-4 rounded-3xl cursor-pointer"><img src="${u.photo}" class="w-12 h-12 rounded-2xl"><div><div class="font-semibold">${u.name}</div><div class="text-sm text-zinc-400">Нажмите для чата</div></div></div>`;
    });
    container.innerHTML = html + `</div>`;
}

function startChat(userId) {
    currentChatUser = matches.find(u => u.id === userId) || fakeUsers.find(u => u.id === userId);
    if (!currentChatUser) return;

    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div>
            <div class="px-4 py-3 border-b flex items-center gap-3 bg-[#0a0a0f]">
                <button onclick="switchTab('messages')" class="text-2xl">←</button>
                <img src="${currentChatUser.photo}" class="w-10 h-10 rounded-full">
                <div class="font-semibold">${currentChatUser.name}</div>
            </div>
            <div id="chat-messages" class="p-4 h-[60vh] overflow-y-auto"></div>
            <div class="p-4 border-t flex gap-2">
                <input id="chat-input" class="flex-1 bg-zinc-900 rounded-2xl px-4 py-3" placeholder="Сообщение..." onkeypress="if(event.key==='Enter') sendMessage()">
                <button onclick="sendMessage()" class="bg-purple-600 px-5 rounded-2xl">➤</button>
            </div>
        </div>`;
    renderChatMessages();
}

function renderChatMessages() {
    const el = document.getElementById('chat-messages');
    if (!el || !currentChatUser) return;
    const msgs = chatMessages[currentChatUser.id] || [];
    el.innerHTML = msgs.map(m => `<div class="${m.fromMe ? 'text-right' : ''} mb-2"><span class="inline-block px-4 py-2 rounded-2xl ${m.fromMe ? 'bg-purple-600' : 'bg-zinc-800'}">${m.text}</span></div>`).join('');
    el.scrollTop = el.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !currentChatUser) return;
    const text = input.value.trim();
    if (!text) return;

    if (!chatMessages[currentChatUser.id]) chatMessages[currentChatUser.id] = [];
    chatMessages[currentChatUser.id].push({ text, fromMe: true, time: new Date().toLocaleTimeString() });
    saveData();
    renderChatMessages();
    input.value = '';

    setTimeout(() => {
        chatMessages[currentChatUser.id].push({ text: "Круто! Расскажи больше 😊", fromMe: false, time: new Date().toLocaleTimeString() });
        saveData();
        renderChatMessages();
    }, 1000);
}

// === AI LOVE COACH ===
function renderAILoveCoach() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div class="p-5">
            <h2 class="text-2xl font-semibold mb-4">AI Love Coach</h2>
            <div id="ai-chat" class="h-[50vh] overflow-y-auto glass p-4 rounded-3xl mb-4"></div>
            <div class="flex gap-2">
                <input id="ai-input" class="flex-1 bg-zinc-900 rounded-2xl px-4 py-3" placeholder="Задай вопрос...">
                <button onclick="sendToAI()" class="bg-purple-600 px-6 rounded-2xl">→</button>
            </div>
        </div>`;
    renderAIChat();
}

function renderAIChat() {
    const el = document.getElementById('ai-chat');
    if (!el) return;
    el.innerHTML = aiConversation.map(m => `<div class="mb-3 ${m.fromUser ? 'text-right' : ''}"><span class="px-4 py-2 rounded-2xl inline-block ${m.fromUser ? 'bg-purple-600' : 'bg-zinc-800'}">${m.text}</span></div>`).join('');
}

function sendToAI() {
    const input = document.getElementById('ai-input');
    if (!input || !input.value.trim()) return;

    aiConversation.push({ text: input.value.trim(), fromUser: true, time: new Date().toLocaleTimeString() });
    renderAIChat();
    input.value = '';

    setTimeout(() => {
        const reply = "Я понимаю. Что именно тебя беспокоит?";
        aiConversation.push({ text: reply, fromUser: false, time: new Date().toLocaleTimeString() });
        saveData();
        renderAIChat();
    }, 1200);
}

// Для теста можно вызвать в консоли: renderAILoveCoach()