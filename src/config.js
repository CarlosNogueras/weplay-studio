export const config = {
    vimeo: {
        username: 'weplaystudio',
        apiUrl: (user) => `https://vimeo.com/api/v2/${user}/videos.json`
    },
    social: {
        instagram: 'https://www.instagram.com/weplay_studio/',
        facebook: 'https://www.facebook.com/weplaystudio/',
        tiktok: 'https://www.tiktok.com/@weplay_studio',
        vimeo: 'https://vimeo.com/weplaystudio'
    },
    portfolio: {
        // Total number of projects shown in "Our Work"
        maxItems: 10,
        // Fill remaining slots with your Vimeo feed (excluding already pinned IDs)
        fillWithVimeo: true,
        // Shuffle the non-pinned Vimeo videos (false = keep newest first)
        shuffleRest: false,
        /**
         * PINNED PROJECTS (always shown first, in this exact order).
         * You can pin:
         *  - A Vimeo video by `vimeoId` (pulls thumbnail/title from Vimeo or uses your overrides)
         *  - A YouTube video by `youtubeId` (auto-loads HD thumbnail + YouTube lightbox embed)
         *  - A local/custom MP4 video by `videoUrl` + `thumbnail`
         */
        pinned: [
            {
                vimeoId: 1173557294,
                title: 'Logo',
                category: 'Animation',
                featured: true
            },
            {
                vimeoId: 1248934281,
                title: 'PULSE - Capítulo cero Teaser - El Desliz',
                category: 'Generative AI',
                featured: true
            },
            {
                vimeoId: 1171980438,
                title: 'The Capsule - Official Trailer 2026',
                category: 'Generative AI',
                featured: true
            }
            // Example YouTube pinned project:
            // {
            //     youtubeId: 'dQw4w9WgXcQ',
            //     title: 'My YouTube Project',
            //     category: 'Generative AI',
            //     description: 'Optional project description',
            //     featured: true
            // }
        ]
    }
};
