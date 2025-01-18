// Main JavaScript functionality for Circle social network

// DOM Elements
const createStoryBtn = document.querySelector('.create-story');
const postInput = document.querySelector('.post-input input');
const postBtn = document.querySelector('.post-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const likeButtons = document.querySelectorAll('.stat i.fa-heart');
const commentButtons = document.querySelectorAll('.stat i.fa-comment');
const bookmarkButtons = document.querySelectorAll('.stat i.fa-bookmark');
const joinButtons = document.querySelectorAll('.join-btn');
const refreshBtn = document.querySelector('.refresh-btn');
const pollBtn = document.querySelector('.post-action-btn:nth-child(2)');
const eventBtn = document.querySelector('.post-action-btn:nth-child(3)');

// State Management
let currentFilter = 'all';
const posts = [];
let stories = [];

// Story Creation
createStoryBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                createNewStory(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

function createNewStory(imageUrl) {
    const storiesSection = document.querySelector('.stories-section');
    const storyCard = document.createElement('div');
    storyCard.className = 'story-card';
    storyCard.innerHTML = `
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="User" class="story-avatar">
        <img src="${imageUrl}" alt="Story" class="story-image">
        <div class="story-info">
            <p>Your Story</p>
        </div>
    `;
    storiesSection.insertBefore(storyCard, storiesSection.children[1]);
}

// Poll Creation
pollBtn.addEventListener('click', () => {
    showPollModal();
});

function showPollModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create Poll</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Question</label>
                    <input type="text" class="poll-question" placeholder="Ask a question...">
                </div>
                <div class="poll-options">
                    <div class="form-group">
                        <input type="text" class="poll-option" placeholder="Option 1">
                    </div>
                    <div class="form-group">
                        <input type="text" class="poll-option" placeholder="Option 2">
                    </div>
                </div>
                <button class="add-option-btn">+ Add Option</button>
                <div class="form-group">
                    <label>Duration</label>
                    <select class="poll-duration">
                        <option value="1">1 hour</option>
                        <option value="24">24 hours</option>
                        <option value="48">48 hours</option>
                        <option value="168">1 week</option>
                    </select>
                </div>
                <button class="create-poll-btn">Create Poll</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add poll modal styles
    const style = document.createElement('style');
    style.textContent = `
        .poll-options {
            margin-bottom: 15px;
        }
        .add-option-btn {
            background: none;
            border: none;
            color: #1d72b8;
            cursor: pointer;
            margin-bottom: 15px;
            padding: 0;
        }
        .poll-duration {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .create-poll-btn {
            width: 100%;
            background: #1d72b8;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Handle adding more options
    const addOptionBtn = modal.querySelector('.add-option-btn');
    const pollOptions = modal.querySelector('.poll-options');
    let optionCount = 2;

    addOptionBtn.addEventListener('click', () => {
        if (optionCount < 4) {
            optionCount++;
            const optionDiv = document.createElement('div');
            optionDiv.className = 'form-group';
            optionDiv.innerHTML = `
                <input type="text" class="poll-option" placeholder="Option ${optionCount}">
            `;
            pollOptions.appendChild(optionDiv);
        }
        if (optionCount === 4) {
            addOptionBtn.style.display = 'none';
        }
    });

    // Handle poll creation
    const createPollBtn = modal.querySelector('.create-poll-btn');
    createPollBtn.addEventListener('click', () => {
        const question = modal.querySelector('.poll-question').value;
        const options = Array.from(modal.querySelectorAll('.poll-option'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');
        const duration = modal.querySelector('.poll-duration').value;

        if (question && options.length >= 2) {
            createPollPost(question, options, duration);
            modal.remove();
        } else {
            alert('Please fill in the question and at least 2 options');
        }
    });

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function createPollPost(question, options, duration) {
    const postsFeed = document.querySelector('.posts-feed');
    const post = document.createElement('div');
    post.className = 'post';
    
    const optionsHTML = options.map(option => `
        <div class="poll-option">
            <div class="poll-progress" style="width: 0%"></div>
            <div class="poll-label">
                <span>${option}</span>
                <span>0%</span>
            </div>
        </div>
    `).join('');

    post.innerHTML = `
        <div class="post-header">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="User" class="post-avatar">
            <div class="post-info">
                <h4>You</h4>
                <p>Just now</p>
            </div>
            <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="post-content">
            <p>${question}</p>
            <div class="poll">
                ${optionsHTML}
            </div>
            <p class="poll-info">0 votes • ${duration} hours left</p>
        </div>
        <div class="post-stats">
            <div class="stat">
                <i class="fas fa-heart"></i>
                <span>0</span>
            </div>
            <div class="stat">
                <i class="fas fa-comment"></i>
                <span>0</span>
            </div>
            <div class="stat">
                <i class="fas fa-share"></i>
                <span>0</span>
            </div>
        </div>
    `;

    postsFeed.insertBefore(post, postsFeed.firstChild);
    initializePostInteractions(post);
    initializePollInteractions(post);
}

function initializePollInteractions(post) {
    const pollOptions = post.querySelectorAll('.poll-option');
    let hasVoted = false;

    pollOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (!hasVoted) {
                hasVoted = true;
                const totalVotes = Math.floor(Math.random() * 50) + 10;
                let remainingPercentage = 100;
                
                // Update all options except the last one
                pollOptions.forEach((opt, index) => {
                    if (index === pollOptions.length - 1) {
                        const percentage = remainingPercentage;
                        opt.querySelector('.poll-progress').style.width = `${percentage}%`;
                        opt.querySelector('.poll-label span:last-child').textContent = `${percentage}%`;
                    } else {
                        const percentage = Math.floor(Math.random() * remainingPercentage);
                        remainingPercentage -= percentage;
                        opt.querySelector('.poll-progress').style.width = `${percentage}%`;
                        opt.querySelector('.poll-label span:last-child').textContent = `${percentage}%`;
                    }
                });

                post.querySelector('.poll-info').textContent = 
                    `${totalVotes} votes • ${post.querySelector('.poll-info').textContent.split('•')[1]}`;
            }
        });
    });
}

// Event Creation
eventBtn.addEventListener('click', () => {
    showEventModal();
});

function showEventModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create Event</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Event Title</label>
                    <input type="text" class="event-title" placeholder="Enter event title...">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="event-description" placeholder="What's this event about?"></textarea>
                </div>
                <div class="form-group">
                    <label>Date & Time</label>
                    <input type="datetime-local" class="event-datetime">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="event-location" placeholder="Where is this event?">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select class="event-category">
                        <option value="academic">Academic</option>
                        <option value="social">Social</option>
                        <option value="career">Career</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button class="create-event-btn">Create Event</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event modal styles
    const style = document.createElement('style');
    style.textContent = `
        .event-description {
            width: 100%;
            height: 100px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            resize: vertical;
        }
        .event-datetime, .event-location, .event-category {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .create-event-btn {
            width: 100%;
            background: #1d72b8;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
        }
    `;
    document.head.appendChild(style);

    // Handle event creation
    const createEventBtn = modal.querySelector('.create-event-btn');
    createEventBtn.addEventListener('click', () => {
        const title = modal.querySelector('.event-title').value;
        const description = modal.querySelector('.event-description').value;
        const datetime = modal.querySelector('.event-datetime').value;
        const location = modal.querySelector('.event-location').value;
        const category = modal.querySelector('.event-category').value;

        if (title && description && datetime && location) {
            createEventPost(title, description, datetime, location, category);
            modal.remove();
        } else {
            alert('Please fill in all fields');
        }
    });

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function createEventPost(title, description, datetime, location, category) {
    const postsFeed = document.querySelector('.posts-feed');
    const post = document.createElement('div');
    post.className = 'post';
    
    const eventDate = new Date(datetime);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    post.innerHTML = `
        <div class="post-header">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="User" class="post-avatar">
            <div class="post-info">
                <h4>You</h4>
                <p>Just now</p>
            </div>
            <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="post-content">
            <div class="event-post">
                <div class="event-category-badge">${category}</div>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="event-details">
                    <div class="event-detail">
                        <i class="far fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="event-detail">
                        <i class="far fa-clock"></i>
                        <span>${formattedTime}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                </div>
                <button class="interested-btn">
                    <i class="far fa-star"></i> Interested
                </button>
            </div>
        </div>
        <div class="post-stats">
            <div class="stat">
                <i class="fas fa-heart"></i>
                <span>0</span>
            </div>
            <div class="stat">
                <i class="fas fa-comment"></i>
                <span>0</span>
            </div>
            <div class="stat">
                <i class="fas fa-share"></i>
                <span>0</span>
            </div>
        </div>
    `;

    // Add event post styles
    const style = document.createElement('style');
    style.textContent = `
        .event-post {
            background: #f8fbff;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
        }
        .event-category-badge {
            display: inline-block;
            background: #1d72b8;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
            margin-bottom: 10px;
            text-transform: capitalize;
        }
        .event-details {
            margin: 15px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .event-detail {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #666;
        }
        .interested-btn {
            background: #1d72b8;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .interested-btn:hover {
            background: #155a94;
        }
    `;
    document.head.appendChild(style);

    postsFeed.insertBefore(post, postsFeed.firstChild);
    initializePostInteractions(post);
    initializeEventInteractions(post);
}

function initializeEventInteractions(post) {
    const interestedBtn = post.querySelector('.interested-btn');
    let isInterested = false;

    interestedBtn.addEventListener('click', () => {
        isInterested = !isInterested;
        if (isInterested) {
            interestedBtn.innerHTML = '<i class="fas fa-star"></i> Interested';
            interestedBtn.style.background = '#27ae60';
        } else {
            interestedBtn.innerHTML = '<i class="far fa-star"></i> Interested';
            interestedBtn.style.background = '#1d72b8';
        }
    });
}

// Post Creation
postBtn.addEventListener('click', () => {
    const content = postInput.value.trim();
    if (content) {
        createNewPost(content);
        postInput.value = '';
    }
});

function createNewPost(content) {
    const postsFeed = document.querySelector('.posts-feed');
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `
        <div class="post-header">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="User" class="post-avatar">
            <div class="post-info">
                <h4>You</h4>
                <p>Just now</p>
            </div>
            <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="post-content">
            <p>${content}</p>
        </div>
        <div class="post-stats">
            <div class="stat">
                <i class="fas fa-heart"></i>
                <span>0</span>
            </div>
            <div class="stat">
                <i class="fas fa-comment"></i>
                <span>0</span>
            </div>
            <div class="stat">
                <i class="fas fa-bookmark"></i>
                <span>0</span>
            </div>
        </div>
    `;
    postsFeed.insertBefore(post, postsFeed.firstChild);
    initializePostInteractions(post);
}

// Post Interactions
function initializePostInteractions(post) {
    const likeBtn = post.querySelector('.fa-heart');
    const commentBtn = post.querySelector('.fa-comment');
    const bookmarkBtn = post.querySelector('.fa-bookmark');

    likeBtn.addEventListener('click', toggleLike);
    commentBtn.addEventListener('click', toggleComment);
    bookmarkBtn.addEventListener('click', toggleBookmark);
}

function toggleLike(e) {
    e.target.classList.toggle('active');
    const countSpan = e.target.nextElementSibling;
    const currentCount = parseInt(countSpan.textContent);
    countSpan.textContent = e.target.classList.contains('active') ? currentCount + 1 : currentCount - 1;
}

function toggleComment(e) {
    const post = e.target.closest('.post');
    const existingCommentSection = post.querySelector('.comment-input-section');
    
    if (existingCommentSection) {
        existingCommentSection.remove();
    } else {
        const commentSection = document.createElement('div');
        commentSection.className = 'comment-input-section';
        commentSection.innerHTML = `
            <div class="comment">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="User" class="comment-avatar">
                <div class="comment-content">
                    <input type="text" placeholder="Write a comment..." class="comment-input">
                </div>
            </div>
        `;
        post.appendChild(commentSection);

        const commentInput = commentSection.querySelector('.comment-input');
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                addComment(post, e.target.value.trim());
                commentSection.remove();
            }
        });
    }
}

function addComment(post, content) {
    const commentsSection = post.querySelector('.post-comments') || document.createElement('div');
    commentsSection.className = 'post-comments';
    
    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.innerHTML = `
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="User" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-header">
                <h5>You</h5>
                <span>Just now</span>
            </div>
            <p>${content}</p>
        </div>
    `;
    
    commentsSection.appendChild(comment);
    if (!post.querySelector('.post-comments')) {
        post.appendChild(commentsSection);
    }

    // Update comment count
    const commentCount = post.querySelector('.fa-comment').nextElementSibling;
    commentCount.textContent = parseInt(commentCount.textContent) + 1;
}

function toggleBookmark(e) {
    e.target.classList.toggle('active');
    const countSpan = e.target.nextElementSibling;
    const currentCount = parseInt(countSpan.textContent);
    countSpan.textContent = e.target.classList.contains('active') ? currentCount + 1 : currentCount - 1;
}

// Filter Posts
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.textContent.toLowerCase();
        filterPosts(currentFilter);
    });
});

function filterPosts(filter) {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        switch(filter) {
            case 'popular':
                const likes = parseInt(post.querySelector('.fa-heart').nextElementSibling.textContent);
                post.style.display = likes > 50 ? 'block' : 'none';
                break;
            case 'following':
                // Implement following filter logic
                post.style.display = 'block';
                break;
            case 'study groups':
                // Implement study groups filter logic
                post.style.display = post.querySelector('.group-info') ? 'block' : 'none';
                break;
            default:
                post.style.display = 'block';
        }
    });
}

// Refresh Trending Topics
refreshBtn.addEventListener('click', () => {
    refreshBtn.style.transform = 'rotate(360deg)';
    // Simulate refresh with setTimeout
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 1000);
});

// Initialize all existing posts
document.querySelectorAll('.post').forEach(initializePostInteractions);

// Add CSS for active states
const style = document.createElement('style');
style.textContent = `
    .stat i.active {
        color: #1d72b8;
    }
    .comment-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 20px;
        outline: none;
    }
    .comment-input:focus {
        border-color: #1d72b8;
    }
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
        border-radius: 10px;
        padding: 20px;
        width: 90%;
        max-width: 500px;
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
    }
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
`;
document.head.appendChild(style);