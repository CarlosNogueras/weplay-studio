import { config } from '../config.js';

const FALLBACK_VIDEOS = [
  {
    id: 1141722560,
    title: 'Comet',
    description: '',
    url: 'https://vimeo.com/1141722560',
    upload_date: '2025-11-29 18:58:16',
    thumbnail_large: 'https://i.vimeocdn.com/video/2089216066-8727053b373ac45da20bb41c1f5d81fbe6bfdba75d7e56982e646f9585d6f9a8-d_640?region=us',
    tags: ''
  },
  {
    id: 1141722404,
    title: 'El Mando',
    description: '',
    url: 'https://vimeo.com/1141722404',
    upload_date: '2025-11-29 18:56:36',
    thumbnail_large: 'https://i.vimeocdn.com/video/2089215832-d2c75612629d3868e31b5f55c7dcd3dc5178587d2ebf4f53a7688a32dc8b6b96-d_640?region=us',
    tags: ''
  },
  {
    id: 1141722044,
    title: 'Guiris',
    description: '',
    url: 'https://vimeo.com/1141722044',
    upload_date: '2025-11-29 18:53:12',
    thumbnail_large: 'https://i.vimeocdn.com/video/2089215337-052d18c84679ca4d501f4f42097b65ff208c6b61205876eb996f692b4cebe42c-d_640?region=us',
    tags: ''
  },
  {
    id: 1141721893,
    title: 'Grafiti',
    description: '',
    url: 'https://vimeo.com/1141721893',
    upload_date: '2025-11-29 18:51:38',
    thumbnail_large: 'https://i.vimeocdn.com/video/2089215078-261a30c399abffa02c2c9534752a8548d8de7a45d8aeb3bf65be038cdfb3d4bc-d_640?region=us',
    tags: ''
  },
  {
    id: 1141721657,
    title: 'Hello',
    description: '',
    url: 'https://vimeo.com/1141721657',
    upload_date: '2025-11-29 18:49:15',
    thumbnail_large: 'https://i.vimeocdn.com/video/2089214753-8acecec688c61edf5cf77d4eff7a03a338ba1658fd13104cab1156016100002c-d_640?region=us',
    tags: ''
  }
];

export function extractVimeoId(url = '') {
  const match = String(url).match(/vimeo\.com\/(?:channels\/[A-z]+\/|groups\/[A-z]+\/videos\/|video\/)?(\d+)/i);
  return match ? match[1] : null;
}

export function extractYouTubeId(url = '') {
  const match = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  return match ? match[1] : null;
}

function normalizeVimeoData(video) {
  return {
    id: String(video.id),
    platform: 'vimeo',
    title: video.title,
    thumbnail: video.thumbnail_large,
    url: video.url,
    description: video.description || '',
    category: 'Vimeo',
    uploadDate: video.upload_date || '',
    tags: video.tags ? video.tags.split(', ').filter(Boolean) : [],
    featured: false
  };
}

function resolvePinnedItem(rawItem, vimeoById) {
  const item = typeof rawItem === 'string' ? { url: rawItem } : rawItem;
  const url = item.url || item.videoUrl || (item.vimeoId ? `https://vimeo.com/${item.vimeoId}` : item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : '');

  const vimeoId = item.vimeoId ? String(item.vimeoId) : extractVimeoId(url);
  if (vimeoId) {
    const match = vimeoById.get(vimeoId);
    return {
      id: vimeoId,
      platform: 'vimeo',
      title: item.title || match?.title || `Vimeo #${vimeoId}`,
      thumbnail: item.thumbnail || match?.thumbnail || '',
      url: match?.url || `https://vimeo.com/${vimeoId}`,
      description: item.description ?? match?.description ?? '',
      category: item.category || 'Vimeo',
      uploadDate: match?.uploadDate || '',
      tags: item.tags || match?.tags || [],
      featured: true
    };
  }

  const youtubeId = item.youtubeId || extractYouTubeId(url);
  if (youtubeId) {
    return {
      id: `yt-${youtubeId}`,
      platform: 'youtube',
      title: item.title || 'YouTube Video',
      thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${youtubeId}`,
      description: item.description || '',
      category: item.category || 'YouTube',
      uploadDate: item.uploadDate || '',
      tags: item.tags || [],
      featured: true
    };
  }

  return {
    id: item.id || url || item.title,
    platform: 'local',
    title: item.title || 'WePlay Project',
    thumbnail: item.thumbnail || '',
    url,
    description: item.description || '',
    category: item.category || 'WePlay Studio',
    uploadDate: item.uploadDate || '',
    tags: item.tags || [],
    featured: true
  };
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function fetchPortfolioConfig() {
  try {
    const res = await fetch('/portfolio.json', { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not load /portfolio.json, falling back to config.js:', err);
  }
  return config.portfolio || { maxItems: 10, fillWithVimeo: true, shuffleRest: false, pinned: [] };
}

export async function fetchPortfolioProjects(customConfig = null) {
  let vimeoVideos = [];
  try {
    const response = await fetch(config.vimeo.apiUrl(config.vimeo.username));
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    vimeoVideos = data.map(normalizeVimeoData);
  } catch (error) {
    console.warn('Error fetching Vimeo videos, using fallback data:', error);
    vimeoVideos = FALLBACK_VIDEOS.map(normalizeVimeoData);
  }

  const portfolioConfig = customConfig || await fetchPortfolioConfig();
  const vimeoById = new Map(vimeoVideos.map((v) => [String(v.id), v]));
  const { pinned = [], fillWithVimeo = true, shuffleRest = false, maxItems = 10 } = portfolioConfig;

  const resolvedPinned = pinned
    .map((item) => resolvePinnedItem(item, vimeoById))
    .filter((item) => item.url);

  const pinnedIds = new Set(resolvedPinned.map((item) => String(item.id)));

  let combined = [...resolvedPinned];

  if (fillWithVimeo) {
    let remaining = vimeoVideos.filter((v) => !pinnedIds.has(String(v.id)));
    if (shuffleRest) {
      remaining = shuffleArray(remaining);
    }
    combined = [...combined, ...remaining];
  }

  return {
    projects: combined.slice(0, maxItems),
    config: portfolioConfig
  };
}

export const fetchVimeoVideos = async () => {
  const { projects } = await fetchPortfolioProjects();
  return projects;
};
