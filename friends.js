// DOM Elements
const addFriendBtn = document.querySelector('.add-friend-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const friendSearch = document.querySelector('.search-container input');
const friendCards = document.querySelectorAll('.friend-card');
const messageButtons = document.querySelectorAll('.message-btn');
const joinStudyButtons = document.querySelectorAll('.join-study-btn');
const moreButtons = document.querySelectorAll('.more-btn');
const suggestionAddButtons = document.querySelectorAll('.add-btn');
const studyBuddyJoinButtons = document.querySelectorAll('.join-btn');
const filterPills = document.querySelectorAll('.filter-pill');

// State Management
let currentTab = 'all friends';
let currentFilter = 'all';
let friends = [];
let suggestions = [];

// Add Friend Modal
addFriendBtn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Friend</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <input type="text" placeholder="Search by name or email" class="friend-search-input">
                <div class="search-results"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            padding: 20px;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        .friend-search-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
});

// Tab Switching
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.textContent.toLowerCase();
        filterFriends();
    });
});

// Friend Search
friendSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterFriends(searchTerm);
});

// Filter Friends
function filterFriends(searchTerm = '') {
    friendCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const major = card.querySelector('.major-tag').textContent.toLowerCase();
        const bio = card.querySelector('.friend-bio').textContent.toLowerCase();
        const status = getStatusFromCard(card);

        let visible = true;

        // Apply tab filter
        if (currentTab === 'online' && status !== 'online') visible = false;
        if (currentTab === 'pending') visible = false; // Implement pending logic

        // Apply search filter
        if (searchTerm && !name.includes(searchTerm) && 
            !major.includes(searchTerm) && !bio.includes(searchTerm)) {
            visible = false;
        }

        // Apply quick filter
        if (currentFilter !== 'all') {
            switch (currentFilter) {
                case 'same major':
                    if (!major.includes('computer science')) visible = false; // Example major
                    break;
                case 'study partners':
                    if (!card.querySelector('.join-study-btn')) visible = false;
                    break;
                // Add other filter cases
            }
        }

        card.style.display = visible ? 'block' : 'none';
    });
}

function getStatusFromCard(card) {
    const statusBadge = card.querySelector('.status-badge');
    if (statusBadge.classList.contains('online')) return 'online';
    if (statusBadge.classList.contains('study-mode')) return 'study-mode';
    return 'offline';
}

// Message Button Functionality
messageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const friendName = btn.closest('.friend-card').querySelector('h3').textContent;
        // Implement chat functionality or redirect to chat page
        console.log(`Opening chat with ${friendName}`);
    });
});

// Join Study Button Functionality
joinStudyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const friendName = btn.closest('.friend-card').querySelector('h3').textContent;
        const studyTopic = btn.closest('.friend-card').querySelector('.friend-bio').textContent;
        
        // Toggle join/leave state
        if (btn.textContent.includes('Join')) {
            btn.innerHTML = '<i class="fas fa-times"></i> Leave Study';
            btn.style.background = '#95a5a6';
        } else {
            btn.innerHTML = '<i class="fas fa-book"></i> Join Study';
            btn.style.background = '#e74c3c';
        }
    });
});

// More Button Functionality
moreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = btn.closest('.friend-card');
        const friendName = card.querySelector('h3').textContent;
        
        // Create and show dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'friend-dropdown';
        dropdown.innerHTML = `
            <button class="dropdown-item"><i class="fas fa-user-minus"></i> Unfriend</button>
            <button class="dropdown-item"><i class="fas fa-ban"></i> Block</button>
            <button class="dropdown-item"><i class="fas fa-flag"></i> Report</button>
        `;
        
        // Position dropdown
        const rect = btn.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 5}px`;
        dropdown.style.left = `${rect.left - 120}px`;
        
        // Add dropdown styles
        const style = document.createElement('style');
        style.textContent = `
            .friend-dropdown {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 5px;
                width: 150px;
                z-index: 100;
            }
            .dropdown-item {
                width: 100%;
                padding: 8px 12px;
                border: none;
                background: none;
                text-align: left;
                font-size: 0.9rem;
                color: #666;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                border-radius: 4px;
            }
            .dropdown-item:hover {
                background: #f5f5f5;
                color: #e74c3c;
            }
        `;
        document.head.appendChild(style);
        
        // Add to document and handle clicks
        document.body.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target) && e.target !== btn) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeDropdown);
        }, 0);
        
        // Handle dropdown actions
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.textContent.trim().toLowerCase();
                handleFriendAction(action, friendName);
                dropdown.remove();
            });
        });
    });
});

function handleFriendAction(action, friendName) {
    switch (action) {
        case 'unfriend':
            if (confirm(`Are you sure you want to unfriend ${friendName}?`)) {
                // Implement unfriend logic
                console.log(`Unfriended ${friendName}`);
            }
            break;
        case 'block':
            if (confirm(`Are you sure you want to block ${friendName}?`)) {
                // Implement block logic
                console.log(`Blocked ${friendName}`);
            }
            break;
        case 'report':
            // Show report modal
            showReportModal(friendName);
            break;
    }
}

function showReportModal(friendName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Report ${friendName}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <select class="report-reason">
                    <option value="">Select a reason</option>
                    <option value="harassment">Harassment</option>
                    <option value="spam">Spam</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="other">Other</option>
                </select>
                <textarea placeholder="Provide additional details..." class="report-details"></textarea>
                <button class="submit-report-btn">Submit Report</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .report-reason {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .report-details {
            width: 100%;
            height: 100px;
            padding: 8px;
            margin-bottom: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
            resize: vertical;
        }
        .submit-report-btn {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
        }
        .submit-report-btn:hover {
            background: #c0392b;
        }
    `;
    document.head.appendChild(style);

    // Handle report submission
    const submitBtn = modal.querySelector('.submit-report-btn');
    submitBtn.addEventListener('click', () => {
        const reason = modal.querySelector('.report-reason').value;
        const details = modal.querySelector('.report-details').value;
        if (reason) {
            // Implement report submission logic
            console.log(`Reported ${friendName} for ${reason}: ${details}`);
            modal.remove();
        } else {
            alert('Please select a reason for reporting');
        }
    });

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add Friend Suggestion Buttons
suggestionAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const suggestion = btn.closest('.suggestion-item');
        const name = suggestion.querySelector('h4').textContent;
        
        // Animate button and change state
        btn.style.width = '80px';
        btn.innerHTML = '<i class="fas fa-check"></i> Sent';
        btn.style.background = '#2ecc71';
        
        setTimeout(() => {
            suggestion.style.opacity = '0';
            setTimeout(() => suggestion.remove(), 300);
        }, 1000);
    });
});

// Study Buddy Join Buttons
studyBuddyJoinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.online-item');
        const name = item.querySelector('h4').textContent;
        const activity = item.querySelector('p').textContent;
        
        if (btn.textContent === 'Join') {
            btn.textContent = 'Leave';
            btn.style.background = '#e74c3c';
        } else {
            btn.textContent = 'Join';
            btn.style.background = '#1d72b8';
        }
    });
});

// Filter Pills
filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.textContent.toLowerCase();
        filterFriends();
    });
});

// Initialize tooltips for better UX
const tooltipElements = document.querySelectorAll('[data-tooltip]');
tooltipElements.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = el.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = el.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    });
    
    el.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
    });
});

// Add tooltip styles
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        pointer-events: none;
        z-index: 1000;
    }
`;
document.head.appendChild(tooltipStyle);