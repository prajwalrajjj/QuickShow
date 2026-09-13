export const youtubeId = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
};

export const youtubeEmbed = (url) => `https://www.youtube.com/embed/${youtubeId(url)}?autoplay=1`;
