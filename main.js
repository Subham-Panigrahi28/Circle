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
        <img src="pic.jpg" alt="User" class="story-avatar">
        <img src="${imageUrl}" alt="Story" class="story-image">
        <div class="story-info">
            <p>Your Story</p>
        </div>
    `;
    storiesSection.insertBefore(storyCard, storiesSection.children[1]);
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

// Join Study Group
joinButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const button = e.target;
        if (button.textContent === 'Join') {
            button.textContent = 'Leave';
            button.style.background = '#e74c3c';
        } else {
            button.textContent = 'Join';
            button.style.background = '#1d72b8';
        }
    });
});

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
`;
document.head.appendChild(style);