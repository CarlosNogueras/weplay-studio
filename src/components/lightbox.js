import { t } from '../i18n.js';

// Lightbox Modal Component (supports Vimeo, YouTube & HTML5 Video with autoplay)
export class Lightbox {
    constructor() {
        this.modal = null;
        this.currentVideo = null;
        this.init();
    }

    init() {
        if (!document.getElementById('lightbox')) {
            this.createModal();
        }
        this.modal = document.getElementById('lightbox');
        this.attachEvents();
    }

    createModal() {
        const modalHTML = `
            <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
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

        const container = document.getElementById('lightbox-media-container');
        container.innerHTML = '';
    }

    renderContent() {
        const { title, thumbnail, url, description, tags, category } = this.currentVideo;

        document.getElementById('lightbox-title').textContent = title;
        document.getElementById('lightbox-category').textContent = category || this.detectPlatform(url);

        const descEl = document.getElementById('lightbox-description');
        descEl.textContent = description || t('lightbox.noDesc');

        const tagsEl = document.getElementById('lightbox-tags');
        if (tags && tags.length > 0) {
            tagsEl.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        } else {
            tagsEl.innerHTML = '';
        }

        const linkEl = document.getElementById('lightbox-link');
        linkEl.textContent = t('lightbox.viewOriginal');
        if (url) {
            linkEl.href = url;
            linkEl.style.display = 'inline-flex';
        } else {
            linkEl.style.display = 'none';
        }

        this.renderVideo(url, thumbnail);
    }

    detectPlatform(url = '') {
        if (/youtube\.com|youtu\.be/i.test(url)) return 'YouTube';
        if (/vimeo\.com/i.test(url)) return 'Vimeo';
        if (/\.(mp4|webm)(\?.*)?$/i.test(url)) return 'WePlay Studio';
        return 'Video';
    }

    renderVideo(url, thumbnail) {
        const container = document.getElementById('lightbox-media-container');

        const youtubeId = this.extractYouTubeId(url);
        if (youtubeId) {
            container.innerHTML = `
                <iframe
                    src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title="YouTube video player"
                    allowfullscreen
                    class="lightbox-iframe">
                </iframe>
            `;
            return;
        }

        const vimeoId = this.extractVimeoId(url);
        if (vimeoId) {
            container.innerHTML = `
                <iframe
                    src="https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    title="Vimeo video player"
                    allowfullscreen
                    class="lightbox-iframe">
                </iframe>
            `;
            return;
        }

        if (/\.(mp4|webm)(\?.*)?$/i.test(url || '')) {
            container.innerHTML = `
                <video
                    src="${url}"
                    poster="${thumbnail || ''}"
                    controls
                    autoplay
                    playsinline
                    class="lightbox-iframe">
                </video>
            `;
            return;
        }

        container.innerHTML = `
            <div class="lightbox-fallback">
                <img src="${thumbnail}" alt="Video thumbnail" class="lightbox-image">
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                    ${t('lightbox.viewOriginal')}
                </a>
            </div>
        `;
    }

    extractYouTubeId(url = '') {
        const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    extractVimeoId(url = '') {
        const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
        const match = url.match(regExp);
        if (match && match[5]) {
            return match[5];
        }
        const simpleMatch = url.match(/(\d+)$/);
        return simpleMatch ? simpleMatch[1] : null;
    }
}
