import { config } from '../config.js';

const FALLBACK_VIDEOS = [
  {
    "id": 1141722560,
    "title": "Comet.mp4",
    "description": "",
    "url": "https://vimeo.com/1141722560",
    "upload_date": "2025-11-29 18:58:16",
    "thumbnail_large": "https://i.vimeocdn.com/video/2089216066-8727053b373ac45da20bb41c1f5d81fbe6bfdba75d7e56982e646f9585d6f9a8-d_640?region=us",
    "tags": ""
  },
  {
    "id": 1141722404,
    "title": "El mando",
    "description": "",
    "url": "https://vimeo.com/1141722404",
    "upload_date": "2025-11-29 18:56:36",
    "thumbnail_large": "https://i.vimeocdn.com/video/2089215832-d2c75612629d3868e31b5f55c7dcd3dc5178587d2ebf4f53a7688a32dc8b6b96-d_640?region=us",
    "tags": ""
  },
  {
    "id": 1141722044,
    "title": "guiris",
    "description": "",
    "url": "https://vimeo.com/1141722044",
    "upload_date": "2025-11-29 18:53:12",
    "thumbnail_large": "https://i.vimeocdn.com/video/2089215337-052d18c84679ca4d501f4f42097b65ff208c6b61205876eb996f692b4cebe42c-d_640?region=us",
    "tags": ""
  },
  {
    "id": 1141721893,
    "title": "grafiti",
    "description": "",
    "url": "https://vimeo.com/1141721893",
    "upload_date": "2025-11-29 18:51:38",
    "thumbnail_large": "https://i.vimeocdn.com/video/2089215078-261a30c399abffa02c2c9534752a8548d8de7a45d8aeb3bf65be038cdfb3d4bc-d_640?region=us",
    "tags": ""
  },
  {
    "id": 1141721657,
    "title": "Hello",
    "description": "",
    "url": "https://vimeo.com/1141721657",
    "upload_date": "2025-11-29 18:49:15",
    "thumbnail_large": "https://i.vimeocdn.com/video/2089214753-8acecec688c61edf5cf77d4eff7a03a338ba1658fd13104cab1156016100002c-d_640?region=us",
    "tags": ""
  }
];

export async function fetchVimeoVideos() {
  try {
    const response = await fetch(config.vimeo.apiUrl(config.vimeo.username));
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.map(normalizeVimeoData);
  } catch (error) {
    console.warn('Error fetching Vimeo videos, using fallback data:', error);
    return FALLBACK_VIDEOS.map(normalizeVimeoData);
  }
}

function normalizeVimeoData(video) {
  return {
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail_large, // 640px width
    url: video.url,
    description: video.description || '',
    uploadDate: video.upload_date,
    tags: video.tags ? video.tags.split(', ') : []
  };
}
