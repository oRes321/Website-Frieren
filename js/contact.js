const DRAFT_KEY = 'contactDraft';
const MAX_CHARS = 500;

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('charCounter');
    
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', () => {
            const remaining = MAX_CHARS - messageInput.value.length;
            charCounter.textContent = `${remaining} символів залишилось`;
            if (remaining < 50) {
                charCounter.style.color = 'red';
            } else {
                charCounter.style.color = '#5f5b55';
            }
        });
    }
    
    if (nameInput) {
        nameInput.addEventListener('input', () => validateField(nameInput));
    }
    if (emailInput) {
        emailInput.addEventListener('input', () => validateField(emailInput));
    }
    if (messageInput) {
        messageInput.addEventListener('input', () => validateField(messageInput));
    }
    
    form.addEventListener('input', () => saveDraft());
    form.addEventListener('submit', handleSubmit);
    loadDraft();
}

function validateField(field) {
    const errorSpan = document.getElementById(`${field.id}Error`);
    let isValid = true;
    let errorMsg = '';
    
    if (field.id === 'name') {
        if (field.value.trim().length < 2) {
            isValid = false;
            errorMsg = '❌ Ім\'я має містити хоча б 2 символи';
        } else if (field.value.trim().length > 50) {
            isValid = false;
            errorMsg = '❌ Ім\'я не може бути довшим за 50 символів';
        } else {
            errorMsg = '✅ Добре';
        }
    }
    
    if (field.id === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMsg = '❌ Введіть коректний email (наприклад: name@domain.com)';
        } else {
            errorMsg = '✅ Добре';
        }
    }
    
    if (field.id === 'message') {
        if (field.value.trim() === '') {
            isValid = false;
            errorMsg = '❌ Повідомлення не може бути порожнім';
        } else if (field.value.length > MAX_CHARS) {
            isValid = false;
            errorMsg = `❌ Повідомлення перевищує ${MAX_CHARS} символів`;
        } else {
            errorMsg = '✅ Добре';
        }
    }
    
    if (errorSpan) {
        errorSpan.textContent = errorMsg;
        if (isValid && errorMsg === '✅ Добре') {
            errorSpan.style.color = 'green';
        } else {
            errorSpan.style.color = 'var(--color-error)';
        }
        errorSpan.style.fontSize = '0.875rem';
        errorSpan.style.display = 'block';
    }
    
    if (isValid && field.value.trim() !== '') {
        field.style.borderColor = 'green';
    } else if (field.value.trim() !== '') {
        field.style.borderColor = 'var(--color-error)';
    } else {
        field.style.borderColor = 'var(--color-border)';
    }
    
    return isValid;
}

function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const isNameValid = nameInput ? validateField(nameInput) : true;
    const isEmailValid = emailInput ? validateField(emailInput) : true;
    const isMessageValid = messageInput ? validateField(messageInput) : true;
    
    return isNameValid && isEmailValid && isMessageValid;
}

function saveDraft() {
    const draft = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        message: document.getElementById('message')?.value || ''
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    
    const draftIndicator = document.getElementById('draftIndicator');
    if (draftIndicator) {
        draftIndicator.textContent = '💾 Чернетку збережено';
        draftIndicator.style.color = 'green';
        setTimeout(() => {
            draftIndicator.textContent = '';
        }, 2000);
    }
}

function loadDraft() {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
        const draft = JSON.parse(saved);
        if (draft.name && document.getElementById('name')) {
            document.getElementById('name').value = draft.name;
        }
        if (draft.email && document.getElementById('email')) {
            document.getElementById('email').value = draft.email;
        }
        if (draft.message && document.getElementById('message')) {
            document.getElementById('message').value = draft.message;
        }
        
        const draftIndicator = document.getElementById('draftIndicator');
        if (draftIndicator) {
            draftIndicator.textContent = '📝 Відновлено збережену чернетку';
            draftIndicator.style.color = 'orange';
            setTimeout(() => {
                draftIndicator.textContent = '';
            }, 3000);
        }
    }
}

function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    const form = document.getElementById('contact-form');
    if (form) form.reset();
    
    const errorSpans = document.querySelectorAll('[id$="Error"]');
    errorSpans.forEach(span => span.textContent = '');
    
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    inputs.forEach(input => input.style.borderColor = 'var(--color-border)');
    
    const draftIndicator = document.getElementById('draftIndicator');
    if (draftIndicator) {
        draftIndicator.textContent = '🗑️ Чернетку очищено';
        draftIndicator.style.color = 'red';
        setTimeout(() => {
            draftIndicator.textContent = '';
        }, 2000);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        const formError = document.getElementById('formError');
        if (formError) {
            formError.textContent = '❌ Будь ласка, виправте помилки у формі';
            formError.style.color = 'red';
            setTimeout(() => {
                formError.textContent = '';
            }, 3000);
        }
        return;
    }
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const resultDiv = document.getElementById('formResult');
    if (resultDiv) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="background: #4a7c59; color: white; padding: 1rem; border-radius: 12px;">
                <h3>✅ Дякуємо, ${data.name}!</h3>
                <p>Ваше повідомлення успішно отримано.</p>
                <hr style="margin: 1rem 0; border-color: rgba(255,255,255,0.3);">
                <p><strong>📧 Email:</strong> ${data.email}</p>
                <p><strong>💬 Повідомлення:</strong></p>
                <p style="background: rgba(255,255,255,0.2); padding: 0.5rem; border-radius: 8px;">${data.message}</p>
                <button class="btn" id="resetFormBtn" style="background: white; color: #2c5f2d; margin-top: 1rem;">📝 Надіслати ще одне</button>
            </div>
        `;
        
        const resetBtn = document.getElementById('resetFormBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                resultDiv.style.display = 'none';
                clearDraft();
            });
        }
    }
    
    localStorage.removeItem(DRAFT_KEY);
    event.target.reset();
    
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    inputs.forEach(input => input.style.borderColor = 'var(--color-border)');
}

document.addEventListener('DOMContentLoaded', initContactForm);