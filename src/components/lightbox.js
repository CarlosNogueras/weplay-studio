// Lightbox Modal Component
export class Lightbox {
    constructor() {
        this.modal = null;
        this.currentVideo = null;
        this.init();
    }

    init() {
        // Create modal structure if it doesn't exist
        if (!document.getElementById('lightbox')) {
            this.createModal();
        }
        this.modal = document.getElementById('lightbox');
        this.attachEvents();
    }

    createModal() {
        const modalHTML = `
            <div id="lightbox" class="lightbox">
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close">&times;</button>
                    <div class="lightbox-main">
                        <div class="lightbox-viewer">
                            <div id="lightbox-media-container"></div>
                        </div>
                        <div class="lightbox-sidebar">
                            <h2 id="lightbox-title" class="lightbox-title"></h2>
                            <p id="lightbox-category" class="lightbox-category"></p>
                            <div id="lightbox-description" class="lightbox-description"></div>
                            <div id="lightbox-tags" class="lightbox-tags"></div>
                            <a id="lightbox-link" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                View Original
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEvents() {
        const closeBtn = this.modal.querySelector('.lightbox-close');
        const overlay = this.modal.querySelector('.lightbox-overlay');

        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(videoData) {
        this.currentVideo = videoData;
        this.renderContent();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear video to stop playback
        const container = document.getElementById('lightbox-media-container');
        container.innerHTML = '';
    }

    renderContent() {
        const { title, thumbnail, url, description, tags } = this.currentVideo;

        // Update title and category
        document.getElementById('lightbox-title').textContent = title;
        document.getElementById('lightbox-category').textContent = 'Vimeo';

        // Update description
        const descEl = document.getElementById('lightbox-description');
        descEl.textContent = description || 'No description available';

        // Update tags
        const tagsEl = document.getElementById('lightbox-tags');
        if (tags && tags.length > 0) {
            tagsEl.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        } else {
            tagsEl.innerHTML = '';
        }

        // Update link
        document.getElementById('lightbox-link').href = url;

        // Render video player WITHOUT autoplay
        this.renderVideo(url, thumbnail);
    }

    renderVideo(url, thumbnail) {
        const container = document.getElementById('lightbox-media-container');

        // Extract Vimeo ID from URL
        const vimeoId = this.extractVimeoId(url);
        console.log('Rendering Vimeo video:', { url, vimeoId });

        if (vimeoId) {
            container.innerHTML = `
                <iframe 
                    src="https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1" 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                    title="Vimeo video player"
                    webkitallowfullscreen 
                    mozallowfullscreen 
                    allowfullscreen
                    class="lightbox-iframe">
                </iframe>
            `;
        } else {
            console.warn('Could not extract Vimeo ID from URL:', url);
            // Fallback to image with a link
            container.innerHTML = `
                <div class="lightbox-fallback">
                    <img src="${thumbnail}" alt="Video thumbnail" class="lightbox-image">
                    <a href="${url}" target="_blank" class="btn btn-primary" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        Watch on Vimeo
                    </a>
                </div>
            `;
        }
    }

    extractVimeoId(url) {
        // Handle various Vimeo URL formats (standard, channels, groups)
        const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
        const match = url.match(regExp);

        if (match && match[5]) {
            return match[5];
        }

        // Fallback for simple numeric ID at the end
        const simpleMatch = url.match(/(\d+)$/);
        return simpleMatch ? simpleMatch[1] : null;
    }
}
