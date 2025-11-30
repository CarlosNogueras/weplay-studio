// Instagram service - Using public endpoints
export async function fetchInstagramPosts(username = 'weplay_studio') {
    try {
        // Using a public Instagram endpoint that doesn't require authentication
        // This fetches the user's public profile data
        const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`);

        if (!response.ok) {
            throw new Error('Failed to fetch Instagram data');
        }

        const data = await response.json();

        // Extract posts from the response
        const posts = data?.graphql?.user?.edge_owner_to_timeline_media?.edges || [];

        return posts.slice(0, 9).map(edge => normalizeInstagramPost(edge.node));
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        // Return mock data as fallback
        return getMockInstagramPosts();
    }
}

function normalizeInstagramPost(post) {
    return {
        id: post.id,
        thumbnail: post.thumbnail_src || post.display_url,
        url: `https://www.instagram.com/p/${post.shortcode}/`,
        caption: post.edge_media_to_caption?.edges[0]?.node?.text || '',
        isVideo: post.is_video,
        likes: post.edge_liked_by?.count || 0,
        comments: post.edge_media_to_comment?.count || 0
    };
}

// Fallback mock data in case API fails
function getMockInstagramPosts() {
    return [
        {
            id: '1',
            thumbnail: 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=WePlay+1',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Check out our latest animation work!',
            isVideo: true,
            likes: 0,
            comments: 0
        },
        {
            id: '2',
            thumbnail: 'https://via.placeholder.com/400x400/050505/FF6B00?text=WePlay+2',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Behind the scenes of our creative process',
            isVideo: false,
            likes: 0,
            comments: 0
        },
        {
            id: '3',
            thumbnail: 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=WePlay+3',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'New project coming soon!',
            isVideo: true,
            likes: 0,
            comments: 0
        },
        {
            id: '4',
            thumbnail: 'https://via.placeholder.com/400x400/050505/FF6B00?text=WePlay+4',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Creative animation studio',
            isVideo: false,
            likes: 0,
            comments: 0
        },
        {
            id: '5',
            thumbnail: 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=WePlay+5',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Generative AI experiments',
            isVideo: true,
            likes: 0,
            comments: 0
        },
        {
            id: '6',
            thumbnail: 'https://via.placeholder.com/400x400/050505/FF6B00?text=WePlay+6',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Our latest work',
            isVideo: false,
            likes: 0,
            comments: 0
        },
        {
            id: '7',
            thumbnail: 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=WePlay+7',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Animation showcase',
            isVideo: true,
            likes: 0,
            comments: 0
        },
        {
            id: '8',
            thumbnail: 'https://via.placeholder.com/400x400/050505/FF6B00?text=WePlay+8',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Creative studio life',
            isVideo: false,
            likes: 0,
            comments: 0
        },
        {
            id: '9',
            thumbnail: 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=WePlay+9',
            url: 'https://www.instagram.com/weplay_studio/',
            caption: 'Follow us for more!',
            isVideo: true,
            likes: 0,
            comments: 0
        }
    ];
}
