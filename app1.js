/** * FLEXISPACE ULTIMATE ENGINE v32.0 
 * STATUS: FULLY OPTIMIZED - MESSENGER STYLE & PLUS REDIRECT
 */

const state = {
    listings: [],
    favSet: new Set(JSON.parse(localStorage.getItem('flexi_favs_2026')) || []),
    activeTab: 'explore',
    chatHistory: {
        "Κώστας Α.": { avatar: "https://i.pravatar.cc/150?u=h1", msgs: [{s:'them', t:'Γεια σου Γιάννη! Ο χώρος είναι έτοιμος.', h:'12:32'}] },
        "Ελένη Μ.": { avatar: "https://i.pravatar.cc/150?u=h2", msgs: [{s:'them', t:'Σε περιμένω στις 2.', h:'10:15'}] }
    }
};

const pricingMatrix = { 
    "Κολωνάκι": { first: 12, next: 2, max: 25 }, 
    "Σύνταγμα": { first: 8, next: 1.5, max: 18 }, 
    "Παγκράτι": { first: 6, next: 1, max: 12 }, 
    "Θεσσαλονίκη": { first: 5, next: 1, max: 12 } 
};

// 1. INIT DATA
function initData() {
    const cities = Object.keys(pricingMatrix);
    const types = ["Parking", "Storage", "Work"];
    state.listings = []; // Reset για σιγουριά
    for(let i=0; i<40; i++) {
        const city = cities[i % cities.length];
        const hostName = i % 2 === 0 ? "Κώστας Α." : "Ελένη Μ.";
        state.listings.push({
            id: 90000 + i, city, type: types[i % 3],
            host: hostName,
            hostImg: state.chatHistory[hostName].avatar,
            priceData: pricingMatrix[city],
            images: [`https://picsum.photos/seed/${i+45}/800/600`],
            rating: (Math.random() * 0.7 + 4.2).toFixed(1),
            desc: "Premium secure node with instant 2026 digital access."
        });
    }
    renderExplore(); renderProfile();
}

// 2. BUILD CARD
function buildCard(l) {
    const isLiked = state.favSet.has(l.id);
    return `
        <div class="w-72 flex-shrink-0 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden relative card-trigger cursor-pointer" data-id="${l.id}">
            <div class="h-48 relative pointer-events-none">
                <img src="${l.images[0]}" class="w-full h-full object-cover">
            </div>
            <div class="like-btn absolute top-4 left-4 w-11 h-11 glass rounded-full flex items-center justify-center z-[100] shadow-lg transition-transform active:scale-75" data-id="${l.id}">
                <i class="fa-solid fa-heart text-xl ${isLiked ? 'heart-active' : 'text-white'} pointer-events-none"></i>
            </div>
            <div class="p-6 pointer-events-none">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[9px] font-black text-purple-600 uppercase">${l.type}</span>
                    <span class="text-[10px] font-bold text-gray-400">⭐ ${l.rating}</span>
                </div>
                <h4 class="font-black italic text-lg truncate">${l.host}</h4>
                <p class="text-2xl font-black text-purple-600 tracking-tighter">${l.priceData.first.toFixed(2)}€</p>
            </div>
        </div>`;
}

// 3. EXPLORE RENDER
function renderExplore(filter = 'All') {
    const container = document.getElementById('city-sections'); // Σωστό ID από το HTML σου
    if(!container) return;
    container.innerHTML = "";

    Object.keys(pricingMatrix).forEach(city => {
        const list = state.listings.filter(l => l.city === city && (filter === 'All' || l.type === filter));
        if(list.length > 0) {
            const section = document.createElement('div');
            section.className = "mb-10";
            section.innerHTML = `<h3 class="text-xl font-black italic mb-4 uppercase tracking-tighter">${city}</h3><div class="flex gap-5 overflow-x-auto no-scrollbar pb-2">${list.map(l => buildCard(l)).join('')}</div>`;
            container.appendChild(section);
        }
    });

    container.onclick = (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            e.stopPropagation();
            handleLike(likeBtn, parseInt(likeBtn.dataset.id));
            return;
        }
        const card = e.target.closest('.card-trigger');
        if (card) openBooking(parseInt(card.dataset.id));
    };
}

// 4. LIKE LOGIC
function handleLike(el, id) {
    const icon = el.querySelector('i');
    if(state.favSet.has(id)) {
        state.favSet.delete(id);
        icon.classList.remove('heart-active');
        icon.classList.add('text-white');
    } else {
        state.favSet.add(id);
        icon.classList.add('heart-active');
        icon.classList.remove('text-white');
    }
    localStorage.setItem('flexi_favs_2026', JSON.stringify([...state.favSet]));
}

// 5. BOOKING MODAL
function openBooking(id) {
    const l = state.listings.find(i => i.id === id);
    document.getElementById('booking-render').innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
                <img src="${l.hostImg}" class="w-12 h-12 rounded-full object-cover shadow-md">
                <h3 class="text-2xl font-black italic uppercase">${l.host}</h3>
            </div>
            <button onclick="closeModal()" class="text-4xl text-gray-200 active:scale-75 transition">&times;</button>
        </div>
        <img src="${l.images[0]}" class="w-full h-64 rounded-[3.5rem] object-cover shadow-2xl mb-8 border-4 border-white">
        <div class="px-2 mb-10">
            <h2 class="text-3xl font-black italic tracking-tighter leading-none">${l.type} Node</h2>
            <p class="text-gray-400 font-bold text-sm mt-2 italic leading-relaxed">${l.desc}</p>
        </div>
        <div class="p-8 bg-white rounded-[3rem] border border-gray-100 flex justify-between items-center shadow-xl mb-4">
            <div><p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Due</p><p class="text-4xl font-black italic text-purple-600 tracking-tighter">${l.priceData.first.toFixed(2)}€</p></div>
            <button onclick="payAction()" class="bg-purple-600 text-white px-10 py-5 rounded-2xl font-black italic text-xs shadow-xl active:scale-95 transition uppercase tracking-tighter">Pay & Lock</button>
        </div>
        <button onclick="openChat('${l.host}', '${l.hostImg}')" class="w-full py-4 text-purple-600 font-black italic uppercase text-xs underline underline-offset-4">Chat with Host</button>`;
    
    document.getElementById('booking-modal').classList.remove('hidden');
}

// 6. CHAT LOGIC (MESSENGER STYLE)
function openChat(name, img) {
    closeModal();
    const chatModal = document.getElementById('chat-modal');
    chatModal.style.display = 'flex'; // Messenger style opening
    
    document.getElementById('chat-name').innerText = name;
    document.getElementById('chat-img').src = img || "https://i.pravatar.cc/150?u=" + name;
    
    if (!state.chatHistory[name]) {
        state.chatHistory[name] = { avatar: img || "https://i.pravatar.cc/150?u=" + name, msgs: [] };
    }
    
    renderBubbles(name);
}

function renderBubbles(name) {
    const flow = document.getElementById('chat-flow');
    const history = state.chatHistory[name].msgs;
    
    flow.innerHTML = history.map(m => `
        <div class="flex ${m.s === 'me' ? 'justify-end' : 'justify-start'} animate-slideUp mb-2">
            <div class="${m.s === 'me' ? 'bg-[#0084ff] text-white rounded-[18px_18px_4px_18px]' : 'bg-[#e4e6eb] text-black rounded-[18px_18px_18px_4px]'} max-w-[75%] text-sm shadow-sm p-3 font-semibold">
                ${m.t}
            </div>
        </div>
    `).join('');
    
    flow.scrollTop = flow.scrollHeight;
}

function realSendMsg() {
    const inp = document.getElementById('chat-input-field');
    const name = document.getElementById('chat-name').innerText;
    
    if (!inp.value.trim() || !name) return;

    state.chatHistory[name].msgs.push({ s: 'me', t: inp.value });
    inp.value = "";
    renderBubbles(name);

    // Messenger Fake Response
    setTimeout(() => {
        state.chatHistory[name].msgs.push({ s: 'them', t: "Έγινε Γιάννη, το έλαβα!" });
        renderBubbles(name);
    }, 1000);
}

// 7. PLUS REDIRECT (Σελίδα Επαλήθευσης / Portal)
function openVerification() {
    closeModal();
    closeChat();
    // Σε πάει κατευθείαν στο Node Access / Digital Key
    document.getElementById('active-portal-modal').style.display = 'flex';
}

// 8. NAVIGATION & UI HELPERS
function navTo(tabId) {
    state.activeTab = tabId;
    closeModal();
    closeChat();
    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    // βρίσκουμε το κουμπί που αντιστοιχεί στο tabId
    const buttons = document.querySelectorAll('.nav-item');
    buttons.forEach(b => {
        if(b.getAttribute('onclick').includes(tabId)) b.classList.add('active');
    });
    
    document.getElementById('app-header').style.display = (tabId === 'explore') ? 'block' : 'none';
    if(tabId === 'messages') renderInbox();
    if(tabId === 'likes') renderSaved();
}

function renderInbox() {
    const container = document.getElementById('inbox-list');
    container.innerHTML = Object.keys(state.chatHistory).map(name => `
        <div class="p-6 bg-white rounded-[2.5rem] flex items-center gap-6 shadow-sm active:scale-95 transition border border-gray-50" onclick="openChat('${name}', '${state.chatHistory[name].avatar}')">
            <img src="${state.chatHistory[name].avatar}" class="w-16 h-16 rounded-2xl object-cover shadow-lg">
            <div class="flex-1">
                <h4 class="font-black italic text-xl uppercase tracking-tighter">${name}</h4>
                <p class="text-sm text-gray-500 italic truncate">${state.chatHistory[name].msgs.length ? state.chatHistory[name].msgs[state.chatHistory[name].msgs.length-1].t : 'Ξεκινήστε τη συζήτηση'}</p>
            </div>
        </div>`).join('');
}

function renderSaved() {
    const container = document.getElementById('fav-list');
    const likedList = state.listings.filter(l => state.favSet.has(l.id));
    container.innerHTML = likedList.length ? likedList.map(l => buildCard(l)).join('') : `<div class="text-center py-40 opacity-30 font-black italic text-2xl uppercase tracking-tighter leading-none px-10">No saved nodes found yet 💜</div>`;
    
    container.onclick = (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            handleLike(likeBtn, parseInt(likeBtn.dataset.id));
            renderSaved(); 
            return;
        }
        const card = e.target.closest('.card-trigger');
        if (card) openBooking(parseInt(card.dataset.id));
    };
}

function performAppLogin() { 
    document.getElementById('splash').style.display = 'none'; 
    document.getElementById('login-screen').style.display = 'none'; 
    document.getElementById('app-header').classList.remove('hidden'); 
    document.getElementById('app-main').classList.remove('hidden'); 
    document.getElementById('bottom-bar').classList.remove('hidden'); 
    document.getElementById('bottom-bar').style.display = 'flex';
    initData(); 
    navTo('explore'); 
}

function closeModal() { document.getElementById('booking-modal').classList.add('hidden'); }
function closeChat() { document.getElementById('chat-modal').style.display = 'none'; }
function closeSubModal(id) { document.getElementById(id).style.display = 'none'; }
function payAction() { closeModal(); document.getElementById('locked-success').classList.remove('hidden'); }
function returnToExplore() { document.getElementById('locked-success').classList.add('hidden'); navTo('explore'); }
function filterBy(cat, btn) { 
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active', 'text-purple-600', 'border-b-2', 'border-purple-600'));
    btn.classList.add('active', 'text-purple-600', 'border-b-2', 'border-purple-600');
    renderExplore(cat); 
}

window.onload = () => { 
    setTimeout(() => { 
        document.getElementById('splash').style.opacity = '0'; 
        setTimeout(() => { 
            document.getElementById('splash').style.display = 'none'; 
            document.getElementById('login-screen').style.display = 'flex'; 
        }, 600); 
    }, 2500); 
};
function openActiveBookingDetails() {
    // Σου ανοίγει το Modal που φτιάξαμε πριν με GPS και Κωδικό
    const modal = document.getElementById('booking-details-modal');
    if(modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
    }
}