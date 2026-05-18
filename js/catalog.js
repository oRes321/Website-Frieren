let allItems = [];
let filteredItems = [];
let currentPage = 1;
let itemsPerPage = 6;
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';
let favorites = [];

const FAVORITES_KEY = 'catalogFavorites';

async function loadItems() {
    try {
        const response = await fetch('../data/items.json');
        if (!response.ok) {
            throw new Error('Не вдалося завантажити дані');
        }
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Помилка:', error);
        throw error;
    }
}

function filterItems() {
    let result = [...allItems];
    
    if (currentCategory !== 'all') {
        result = result.filter(item => item.category === currentCategory);
    }
    
    if (currentSearch.trim() !== '') {
        const searchLower = currentSearch.toLowerCase();
        result = result.filter(item => 
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower)
        );
    }
    
    return result;
}

function sortItems(items) {
    const sorted = [...items];
    
    switch (currentSort) {
        case 'title-asc':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        default:
            sorted.sort((a, b) => a.id - b.id);
    }
    
    return sorted;
}

function loadFavorites() {
    const saved = localStorage.getItem(FAVORITES_KEY);
    favorites = saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    saveFavorites();
    renderCatalog();
}

function isFavorite(id) {
    return favorites.includes(id);
}

function renderCatalog() {
    const container = document.getElementById('catalogContainer');
    if (!container) return;
    
    let items = filterItems();
    filteredItems = items;
    items = sortItems(items);
    
    const emptyState = document.getElementById('emptyState');
    if (items.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(0, endIndex);
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (endIndex >= items.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    container.innerHTML = paginatedItems.map(item => `
        <div class="catalog-card" data-id="${item.id}">
            <div class="card-badge">⭐ ${item.rating}</div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p class="card-category">📁 ${getCategoryName(item.category)}</p>
                <p class="card-description">${item.description.substring(0, 80)}...</p>
                <p class="card-price">💰 ${item.price} грн</p>
                <div class="card-buttons">
                    <button class="btn-details" data-id="${item.id}">📖 Детальніше</button>
                    <button class="btn-favorite ${isFavorite(item.id) ? 'active' : ''}" data-id="${item.id}">
                        ${isFavorite(item.id) ? '❤️ В обраному' : '🤍 В обране'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            showDetails(id);
        });
    });
    
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleFavorite(id);
        });
    });
}

function showDetails(id) {
    const item = allItems.find(i => i.id === id);
    if (!item) return;
    
    const modal = document.getElementById('detailsModal');
    const modalDetails = document.getElementById('modalDetails');
    
    if (modalDetails) {
        modalDetails.innerHTML = `
            <h2>${item.title}</h2>
            <p class="detail-category">Категорія: ${getCategoryName(item.category)}</p>
            <p class="detail-rating">⭐ Рейтинг: ${item.rating} / 5</p>
            <p class="detail-price">💰 Ціна: ${item.price} грн</p>
            <p class="detail-description">${item.description}</p>
            <button class="btn-favorite-detail" data-id="${item.id}">
                ${isFavorite(item.id) ? '❤️ В обраному' : '🤍 Додати в обране'}
            </button>
        `;
        
        const favDetailBtn = modalDetails.querySelector('.btn-favorite-detail');
        if (favDetailBtn) {
            favDetailBtn.addEventListener('click', () => {
                toggleFavorite(item.id);
                showDetails(id);
            });
        }
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function updateCatalog() {
    currentPage = 1;
    renderCatalog();
}

function getCategoryName(category) {
    const categories = {
        'magic': '🔮 Магія',
        'book': '📖 Книги',
        'potion': '🧪 Зілля',
        'accessory': '💍 Аксесуари'
    };
    return categories[category] || category;
}

function showLoading() {
    const loading = document.getElementById('loadingState');
    const container = document.getElementById('catalogContainer');
    const error = document.getElementById('errorState');
    if (loading) loading.style.display = 'block';
    if (container) container.style.display = 'none';
    if (error) error.style.display = 'none';
}

function hideLoading() {
    const loading = document.getElementById('loadingState');
    const container = document.getElementById('catalogContainer');
    if (loading) loading.style.display = 'none';
    if (container) container.style.display = 'grid';
}

function showError() {
    const error = document.getElementById('errorState');
    const loading = document.getElementById('loadingState');
    const container = document.getElementById('catalogContainer');
    if (error) error.style.display = 'block';
    if (loading) loading.style.display = 'none';
    if (container) container.style.display = 'none';
}

async function initCatalog() {
    const container = document.getElementById('catalogContainer');
    if (!container) return;
    
    loadFavorites();
    
    showLoading();
    
    try {
        allItems = await loadItems();
        hideLoading();
        renderCatalog();
        
        initControls();
        
    } catch (error) {
        console.error('Помилка:', error);
        showError();
    }
}

function initControls() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            updateCatalog();
        });
    }
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            updateCatalog();
        });
    });
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderCatalog();
        });
    }
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderCatalog();
        });
    }
    
    const modal = document.getElementById('detailsModal');
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initCatalog);