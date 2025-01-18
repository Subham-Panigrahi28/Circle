// DOM Elements
const createChannelBtn = document.querySelector('.create-channel-btn');
const channelSearchBar = document.querySelector('.channel-search-bar');
const joinButtons = document.querySelectorAll('.join-btn');
const joinedButtons = document.querySelectorAll('.joined-btn');
const channels = document.querySelectorAll('.channel');

// State Management
let userChannels = new Set(); // Track joined channels

// Create Channel Modal
createChannelBtn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create New Channel</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="channel-name">Channel Name</label>
                    <input type="text" id="channel-name" placeholder="e.g., project-discussion">
                </div>
                <div class="form-group">
                    <label for="channel-description">Description</label>
                    <textarea id="channel-description" placeholder="What's this channel about?"></textarea>
                </div>
                <div class="form-group">
                    <label for="channel-category">Category</label>
                    <select id="channel-category">
                        <option value="computer-science">Computer Science</option>
                        <option value="data-science">Data Science</option>
                        <option value="general">General</option>
                        <option value="events">Events</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="channel-private">
                        Make this channel private
                    </label>
                </div>
                <button class="create-btn">Create Channel</button>
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
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: 500;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9rem;
        }
        .form-group textarea {
            height: 100px;
            resize: vertical;
        }
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
        .checkbox-label input {
            width: auto;
        }
        .create-btn {
            background: #1d72b8;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-size: 1rem;
            margin-top: 10px;
        }
        .create-btn:hover {
            background: #154a7e;
        }
    `;
    document.head.appendChild(style);

    // Handle channel creation
    const createBtn = modal.querySelector('.create-btn');
    createBtn.addEventListener('click', () => {
        const name = modal.querySelector('#channel-name').value.trim();
        const description = modal.querySelector('#channel-description').value.trim();
        const category = modal.querySelector('#channel-category').value;
        const isPrivate = modal.querySelector('#channel-private').checked;

        if (name && description) {
            createNewChannel(name, description, category, isPrivate);
            modal.remove();
        } else {
            alert('Please fill in all required fields');
        }
    });

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
});

// Create new channel
function createNewChannel(name, description, category, isPrivate) {
    const channelSection = document.querySelector('.section:last-child');
    const newChannel = document.createElement('div');
    newChannel.className = 'channel';
    newChannel.innerHTML = `
        <div class="channel-info">
            <h3># ${name} <span class="live-badge">NEW</span></h3>
            <p>${description}</p>
            <p class="meta"><span>1</span> Active now | ${category.replace('-', ' ')}</p>
        </div>
        <button class="joined-btn">Joined</button>
    `;
    channelSection.appendChild(newChannel);
    
    // Add animation
    newChannel.style.animation = 'slideIn 0.3s ease-out';
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Channel Search
channelSearchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    channels.forEach(channel => {
        const name = channel.querySelector('h3').textContent.toLowerCase();
        const description = channel.querySelector('p').textContent.toLowerCase();
        const meta = channel.querySelector('.meta').textContent.toLowerCase();
        
        const matches = name.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       meta.includes(searchTerm);
        
        channel.style.display = matches ? 'flex' : 'none';
    });
});

// Join Button Functionality
joinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const channel = btn.closest('.channel');
        const channelName = channel.querySelector('h3').textContent;
        
        // Toggle join state
        if (btn.textContent === 'Join') {
            btn.textContent = 'Joined';
            btn.className = 'joined-btn';
            userChannels.add(channelName);
            
            // Show success notification
            showNotification(`Joined ${channelName}`);
        }
    });
});

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1d72b8;
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
            z-index: 1000;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Live Badge Update
function updateLiveBadges() {
    const liveBadges = document.querySelectorAll('.live-badge');
    liveBadges.forEach(badge => {
        if (Math.random() > 0.7) { // 30% chance to show as inactive
            badge.style.backgroundColor = '#95a5a6';
            badge.textContent = 'INACTIVE';
        }
    });
}

// Update active users count periodically
function updateActiveUsers() {
    const metaElements = document.querySelectorAll('.meta span');
    metaElements.forEach(span => {
        const currentCount = parseInt(span.textContent);
        const variation = Math.floor(Math.random() * 11) - 5; // Random number between -5 and 5
        const newCount = Math.max(1, currentCount + variation);
        span.textContent = newCount;
    });
}

// Initialize periodic updates
setInterval(updateLiveBadges, 30000); // Every 30 seconds
setInterval(updateActiveUsers, 10000); // Every 10 seconds

// Initialize tooltips
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