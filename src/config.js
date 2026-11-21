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
                vimeoId: 1141722560,
                title: 'Comet',
                category: 'Animation',
                featured: true
            },
            {
                vimeoId: 1141722404,
                title: 'El Mando',
                category: 'Animation',
                featured: true
            },
            {
                vimeoId: 1141721893,
                title: 'Grafiti',
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
