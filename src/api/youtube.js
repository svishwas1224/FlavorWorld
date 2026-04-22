// YouTube Data API v3 integration
// Note: You'll need to provide your own API key for this to work
// Get one from: https://console.developers.google.com/

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || ''
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

export const youtubeAPI = {
  // Search for recipe videos
  searchRecipeVideos: async (mealName, maxResults = 3) => {
    if (!YOUTUBE_API_KEY) {
      // Return fallback data if no API key is provided
      return {
        fallback: true,
        videos: []
      }
    }

    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(mealName + ' recipe')}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error('YouTube API request failed')
      }
      
      const data = await response.json()
      
      return {
        fallback: false,
        videos: data.items.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          duration: 'Unknown' // Duration requires additional API call
        }))
      }
    } catch (error) {
      console.error('YouTube API error:', error)
      return {
        fallback: true,
        videos: []
      }
    }
  },

  // Generate YouTube search URL for fallback
  generateSearchUrl: (mealName) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(mealName + ' recipe')}`
  },

  // Get YouTube video thumbnail URL
  getVideoThumbnailUrl: (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  },

  // Get YouTube video URL
  getVideoUrl: (videoId) => {
    return `https://youtube.com/watch?v=${videoId}`
  }
}
