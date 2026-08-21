import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
axios.defaults.timeout = 10000; // 10s timeout to allow Render free server instances to wake up from sleep mode without timing out

const MOCK_POEMS = [
  {
    _id: 'mock-1',
    title: 'The Whispering Wind',
    content: `When the sun sinks low, and shadows grow tall,
I hear a soft voice echo down the hall.
A whisper of pages, of stories untold,
Of secrets in ink, and of dreams made of gold.

It speaks of the hills, where the wild flowers bloom,
And sweeps through the corners of my quiet room.
It carries the scent of the rain and the pine,
And weaves a sweet thread between your soul and mine.

So close your eyes now, let the evening commence,
And listen closely to the wind's eloquence.`,
    author: 'NaKSh',
    writtenDate: '2026-08-10T12:00:00Z',
    views: 142,
    avgRating: 4.8,
    totalRatings: 25,
    tags: ['Nature', 'Dreams', 'Whisper']
  },
  {
    _id: 'mock-2',
    title: 'Shadows in the Silence',
    content: `In the quietest hour, when the world is asleep,
There are secrets of old that the shadows will keep.
They dance on the ceiling, they crawl on the floor,
Tracing the outlines of memory's door.

A silhouette stands where the windowpane gleams,
A silent companion in the forest of dreams.
They do not speak words, yet their meaning is clear,
In the space between holding and letting go near.

For every bright light must a shadow create,
A beautiful balance of passion and fate.`,
    author: 'NaKSh',
    writtenDate: '2026-08-12T15:30:00Z',
    views: 98,
    avgRating: 4.6,
    totalRatings: 18,
    tags: ['Introspective', 'Silence', 'Night']
  },
  {
    _id: 'mock-3',
    title: 'Midnight Echoes',
    content: `The clock strikes twelve, a solitary chime,
A gentle reminder of the passing of time.
The stars are like teardrops of silver and blue,
Spilled on a canvas of infinite hue.

I write of the times that have drifted away,
Like ships in the fog at the break of the day.
And yet in the echo that floats through the night,
I find a small spark of a comforting light.

It tells me that nothing is truly forgot,
In the ink of the mind, and the tales we are taught.`,
    author: 'NaKSh',
    writtenDate: '2026-08-14T00:05:00Z',
    views: 210,
    avgRating: 4.9,
    totalRatings: 34,
    tags: ['Midnight', 'Reflection', 'Hope']
  },
  {
    _id: 'mock-4',
    title: 'A Dance of Dust',
    content: `In a single gold beam of the afternoon sun,
A million small particles dance one by one.
They rise and they fall in a silent ballet,
With no stage to stand on, no music to play.

We are like them, in the grand cosmic scheme,
Drifting through space on the breath of a dream.
Unnoticed, untethered, yet shining so bright,
When caught in the path of the truth's golden light.

So dance in the silence, and welcome the breeze,
For we are but stardust that floats through the trees.`,
    author: 'NaKSh',
    writtenDate: '2026-08-16T10:45:00Z',
    views: 175,
    avgRating: 4.7,
    totalRatings: 29,
    tags: ['Cosmic', 'Philosophy', 'Aesthetic']
  },
  {
    _id: 'mock-5',
    title: 'Eternity in a Moment',
    content: `To hold all the world in the palm of your hand,
To find a whole desert in one grain of sand.
We chase after years that go rushing on by,
Forgetting the magic of one single sigh.

A glance in the mirror, a touch of the hand,
An unspoken promise we both understand.
It takes but a second for worlds to align,
For mortal existence to feel so divine.

Don't seek for the future, don't mourn for the past,
It's the breath of the present that's destined to last.`,
    author: 'NaKSh',
    writtenDate: '2026-08-18T09:00:00Z',
    views: 88,
    avgRating: 5.0,
    totalRatings: 12,
    tags: ['Time', 'Love', 'Eternity']
  }
];

// Helper to initialize local poems safely
function initLocalPoems() {
  try {
    const local = localStorage.getItem('local_poems');
    if (!local || local === 'undefined' || local === 'null') {
      localStorage.setItem('local_poems', JSON.stringify(MOCK_POEMS));
      return MOCK_POEMS;
    }
    const parsed = JSON.parse(local);
    if (!Array.isArray(parsed)) {
      localStorage.setItem('local_poems', JSON.stringify(MOCK_POEMS));
      return MOCK_POEMS;
    }
    return parsed;
  } catch (e) {
    console.error('Error parsing local poems, resetting:', e);
    localStorage.setItem('local_poems', JSON.stringify(MOCK_POEMS));
    return MOCK_POEMS;
  }
}

// Safely get local reader
function getLocalReaderSafe() {
  try {
    const local = localStorage.getItem('local_reader');
    if (local && local !== 'undefined' && local !== 'null') {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Error parsing local reader:', e);
  }
  return null;
}

// Safely get local ratings list
function getLocalRatingsSafe() {
  try {
    const local = localStorage.getItem('local_ratings');
    if (local && local !== 'undefined' && local !== 'null') {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error parsing local ratings:', e);
  }
  return [];
}

// Safely get custom themes list
function getCustomThemesSafe() {
  try {
    const local = localStorage.getItem('custom_themes');
    if (local && local !== 'undefined' && local !== 'null') {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error parsing custom themes:', e);
  }
  return [];
}

export async function getPoems() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/poems?status=published&limit=1000`);
    if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend API not reachable. Using local poems:', error.message);
  }

  return initLocalPoems();
}

export async function getAdminPoems() {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_BASE_URL}/api/poems?status=all&limit=1000`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend getAdminPoems failed. Using local poems:', error.message);
  }

  return initLocalPoems();
}

// Reader APIs
export async function createReader(readerData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/readers`, readerData);
    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend createReader failed. Saving locally:', error.message);
  }

  const localReader = {
    _id: `local-reader-${Math.random().toString(36).substr(2, 9)}`,
    ...readerData,
    annotations: {},
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('local_reader', JSON.stringify(localReader));
  return localReader;
}

export async function getReader(readerId) {
  try {
    if (readerId && !readerId.startsWith('local-reader-')) {
      const response = await axios.get(`${API_BASE_URL}/api/readers/${readerId}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
  } catch (error) {
    console.warn('Backend getReader failed. Checking localStorage:', error.message);
  }

  const localReader = getLocalReaderSafe();
  if (localReader && localReader._id === readerId) {
    return localReader;
  }
  return null;
}

export async function updateReader(readerId, readerData) {
  try {
    if (readerId && !readerId.startsWith('local-reader-')) {
      const response = await axios.put(`${API_BASE_URL}/api/readers/${readerId}`, readerData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
  } catch (error) {
    console.warn('Backend updateReader failed. Updating locally:', error.message);
  }

  const localReader = getLocalReaderSafe() || {};
  const updatedReader = { ...localReader, ...readerData };
  localStorage.setItem('local_reader', JSON.stringify(updatedReader));
  return updatedReader;
}

// Ratings & Comments APIs
export async function submitRating(ratingData) {
  try {
    if (ratingData.readerId && !ratingData.readerId.startsWith('local-reader-')) {
      const response = await axios.post(`${API_BASE_URL}/api/ratings`, ratingData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
  } catch (error) {
    console.warn('Backend submitRating failed. Storing locally:', error.message);
  }

  const localRating = {
    _id: `local-rating-${Math.random().toString(36).substr(2, 9)}`,
    ...ratingData,
    createdAt: new Date().toISOString()
  };
  const allLocalRatings = getLocalRatingsSafe();
  const filteredRatings = allLocalRatings.filter(
    r => !(r.poemId === ratingData.poemId && r.readerId === ratingData.readerId)
  );
  filteredRatings.push(localRating);
  localStorage.setItem('local_ratings', JSON.stringify(filteredRatings));

  // Update averages in local poems list
  const allLocalPoems = initLocalPoems();
  const updatedPoems = allLocalPoems.map(p => {
    if (p._id === ratingData.poemId) {
      const poemRatings = filteredRatings.filter(r => r.poemId === p._id);
      const totalRatings = poemRatings.length;
      const avgRating = totalRatings > 0 
        ? parseFloat((poemRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)) 
        : 0;
      return { ...p, totalRatings, avgRating };
    }
    return p;
  });
  localStorage.setItem('local_poems', JSON.stringify(updatedPoems));

  return localRating;
}

export async function getPoemRatings(poemId) {
  let serverRatings = [];
  try {
    const response = await axios.get(`${API_BASE_URL}/api/ratings/poem/${poemId}/feedback`);
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      serverRatings = response.data.data;
    }
  } catch (error) {
    console.warn('Backend getPoemRatings failed. Using local storage:', error.message);
  }

  const allLocalRatings = getLocalRatingsSafe();
  const localPoemRatings = allLocalRatings.filter(r => r.poemId === poemId && r.isPublic);

  const currentLocalReader = getLocalReaderSafe() || {};
  const localRatingsWithReader = localPoemRatings.map(r => ({
    ...r,
    readerId: r.readerId === currentLocalReader._id ? currentLocalReader : { name: 'Anonymous', profilePicture: 'cat' }
  }));

  return [...serverRatings, ...localRatingsWithReader];
}

// Annotations APIs
export async function saveAnnotations(readerId, annotations) {
  try {
    if (readerId && !readerId.startsWith('local-reader-')) {
      const response = await axios.post(`${API_BASE_URL}/api/readers/${readerId}/annotations`, { annotations });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
  } catch (error) {
    console.warn('Backend saveAnnotations failed. Saving locally:', error.message);
  }

  localStorage.setItem(`annotations_${readerId}`, JSON.stringify(annotations));
  return { success: true, annotations };
}

export async function getAnnotations(readerId) {
  try {
    if (readerId && !readerId.startsWith('local-reader-')) {
      const response = await axios.get(`${API_BASE_URL}/api/readers/${readerId}/annotations`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
  } catch (error) {
    console.warn('Backend getAnnotations failed. Reading locally:', error.message);
  }

  try {
    const annotations = localStorage.getItem(`annotations_${readerId}`);
    if (annotations && annotations !== 'undefined' && annotations !== 'null') {
      return JSON.parse(annotations);
    }
  } catch (e) {
    console.error('Error parsing annotations:', e);
  }
  return {};
}

// Theme APIs
export async function getBackendThemes() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/themes`);
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend getBackendThemes failed. Using local storage:', error.message);
  }

  return getCustomThemesSafe();
}

export async function createTheme(themeData) {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.post(`${API_BASE_URL}/api/themes`, themeData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend createTheme failed. Saving locally:', error.message);
  }

  const localTheme = {
    _id: `local-theme-${Math.random().toString(36).substr(2, 9)}`,
    ...themeData,
    createdAt: new Date().toISOString()
  };
  const customThemes = getCustomThemesSafe();
  customThemes.push(localTheme);
  localStorage.setItem('custom_themes', JSON.stringify(customThemes));

  return localTheme;
}

export async function updateTheme(themeId, themeData) {
  try {
    const token = localStorage.getItem('admin_token');
    if (themeId && !themeId.startsWith('local-theme-')) {
      const response = await axios.put(`${API_BASE_URL}/api/themes/${themeId}`, themeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
  } catch (error) {
    console.warn('Backend updateTheme failed. Updating locally:', error.message);
  }

  const customThemes = getCustomThemesSafe();
  const updatedThemes = customThemes.map(t => t._id === themeId ? { ...t, ...themeData } : t);
  localStorage.setItem('custom_themes', JSON.stringify(updatedThemes));

  return { _id: themeId, ...themeData };
}

export async function deleteTheme(themeId) {
  try {
    const token = localStorage.getItem('admin_token');
    if (themeId && !themeId.startsWith('local-theme-')) {
      const response = await axios.delete(`${API_BASE_URL}/api/themes/${themeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        return true;
      }
    }
  } catch (error) {
    console.warn('Backend deleteTheme failed. Deleting locally:', error.message);
  }

  const customThemes = getCustomThemesSafe();
  const updatedThemes = customThemes.filter(t => t._id !== themeId);
  localStorage.setItem('custom_themes', JSON.stringify(updatedThemes));

  return true;
}

// ADMIN WORKSPACE ENDPOINTS
export async function adminLogin(username, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/login`, { username, password });
    if (response.data && response.data.success) {
      localStorage.setItem('admin_token', response.data.token);
      return response.data;
    }
  } catch (error) {
    console.warn('Backend adminLogin failed. Authenticating locally:', error.message);
  }

  if (username === 'NaKSh' && password === 'NaKShPoetry123') {
    const mockData = {
      success: true,
      message: 'Login successful (local fallback)',
      token: 'mock-jwt-token-xyz',
      admin: { id: 'local-admin', username: 'NaKSh', email: 'admin@mydiary.local' }
    };
    localStorage.setItem('admin_token', mockData.token);
    return mockData;
  }
  
  throw new Error('Invalid credentials');
}

export async function getDashboardStats() {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend getDashboardStats failed. Calculating locally:', error.message);
  }

  const localPoems = initLocalPoems();
  const localRatings = getLocalRatingsSafe();
  
  const totalPoems = localPoems.length;
  const publishedPoems = localPoems.filter(p => p.status === 'published' || p.status === undefined).length;
  const draftPoems = totalPoems - publishedPoems;

  const totalViews = localPoems.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalRatingsCount = localRatings.length;
  const avgRating = totalRatingsCount > 0
    ? parseFloat((localRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatingsCount).toFixed(1))
    : 4.8;

  const localReader = getLocalReaderSafe();
  const totalReadersCount = localReader ? 1 : 0;

  return {
    poems: { total: totalPoems, published: publishedPoems, draft: draftPoems },
    readers: { total: totalReadersCount + 5, subscribed: totalReadersCount + 2 },
    engagement: {
      totalRatings: totalRatingsCount + 25,
      avgRating,
      totalViews: totalViews + 713
    }
  };
}

export async function getAdminSettings() {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_BASE_URL}/api/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend getSettings failed. Reading locally:', error.message);
  }

  try {
    const localSettings = localStorage.getItem('local_settings');
    if (localSettings && localSettings !== 'undefined' && localSettings !== 'null') {
      return JSON.parse(localSettings);
    }
  } catch (e) {
    console.error('Error parsing settings:', e);
  }

  return {
    defaultTheme: 'dark',
    siteTitle: 'My Diary',
    siteDescription: 'A premium poetry sharing platform by NaKSh',
    emailNotificationsEnabled: true
  };
}

export async function getReadersList() {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_BASE_URL}/api/readers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend getReadersList failed:', error.message);
  }
  return [];
}

export async function updateAdminSettings(settings) {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${API_BASE_URL}/api/admin/settings`, settings, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend updateSettings failed. Saving locally:', error.message);
  }

  localStorage.setItem('local_settings', JSON.stringify(settings));
  return settings;
}

export async function createPoem(poemData) {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.post(`${API_BASE_URL}/api/poems`, poemData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Backend createPoem failed. Saving locally:', error.message);
  }

  const localPoems = initLocalPoems();
  const newPoem = {
    _id: `local-poem-${Math.random().toString(36).substr(2, 9)}`,
    ...poemData,
    author: 'NaKSh',
    views: 0,
    avgRating: 0,
    totalRatings: 0,
    uploadedDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  localPoems.unshift(newPoem);
  localStorage.setItem('local_poems', JSON.stringify(localPoems));
  return newPoem;
}

export async function updatePoem(poemId, poemData) {
  try {
    const token = localStorage.getItem('admin_token');
    if (poemId && !poemId.startsWith('local-poem-')) {
      const response = await axios.put(`${API_BASE_URL}/api/poems/${poemId}`, poemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    }
  } catch (error) {
    console.warn('Backend updatePoem failed. Updating locally:', error.message);
  }

  const localPoems = initLocalPoems();
  const updatedPoems = localPoems.map(p => p._id === poemId ? { ...p, ...poemData } : p);
  localStorage.setItem('local_poems', JSON.stringify(updatedPoems));
  
  return { _id: poemId, ...poemData };
}

export async function deletePoem(poemId) {
  try {
    const token = localStorage.getItem('admin_token');
    if (poemId && !poemId.startsWith('local-poem-')) {
      const response = await axios.delete(`${API_BASE_URL}/api/poems/${poemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        return true;
      }
    }
  } catch (error) {
    console.warn('Backend deletePoem failed. Deleting locally:', error.message);
  }

  const localPoems = initLocalPoems();
  const filtered = localPoems.filter(p => p._id !== poemId);
  localStorage.setItem('local_poems', JSON.stringify(filtered));

  const localRatings = getLocalRatingsSafe();
  const filteredRatings = localRatings.filter(r => r.poemId !== poemId);
  localStorage.setItem('local_ratings', JSON.stringify(filteredRatings));

  return true;
}

export async function deleteRating(ratingId) {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.delete(`${API_BASE_URL}/api/ratings/${ratingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success) {
      return true;
    }
  } catch (error) {
    console.warn('Backend deleteRating failed. Deleting locally:', error.message);
  }

  const localRatings = getLocalRatingsSafe();
  const ratingToDelete = localRatings.find(r => r._id === ratingId);
  
  const filtered = localRatings.filter(r => r._id !== ratingId);
  localStorage.setItem('local_ratings', JSON.stringify(filtered));

  if (ratingToDelete) {
    const localPoems = initLocalPoems();
    const updated = localPoems.map(p => {
      if (p._id === ratingToDelete.poemId) {
        const poemRatings = filtered.filter(r => r.poemId === p._id);
        const total = poemRatings.length;
        const avg = total > 0 ? parseFloat((poemRatings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)) : 0;
        return { ...p, totalRatings: total, avgRating: avg };
      }
      return p;
    });
    localStorage.setItem('local_poems', JSON.stringify(updated));
  }

  return true;
}

// Subscription & Newsletter APIs
export async function subscribeNewsletter(email, readerId, preference = 'instant') {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/subscriptions`, {
      email,
      readerId,
      preference
    });
    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.warn('Backend subscribeNewsletter failed. Storing locally:', error.message);
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error || 'Subscription failed');
    }
  }

  const localSubs = getLocalSubscriptionsSafe();
  const existing = localSubs.find(s => s.email.toLowerCase() === email.toLowerCase());
  
  if (existing) {
    if (existing.isActive) {
      throw new Error('Email already subscribed');
    }
    existing.isActive = true;
    existing.preference = preference;
    localStorage.setItem('local_subscriptions', JSON.stringify(localSubs));
    return { success: true, message: 'Subscription reactivated (local)', data: existing };
  }

  const newSub = {
    _id: `local-sub-${Math.random().toString(36).substr(2, 9)}`,
    email,
    readerId,
    preference,
    isActive: true,
    unsubscribeToken: `mock-token-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  localSubs.push(newSub);
  localStorage.setItem('local_subscriptions', JSON.stringify(localSubs));
  return { success: true, message: 'Successfully subscribed to newsletter (local)', data: newSub };
}

function getLocalSubscriptionsSafe() {
  try {
    const local = localStorage.getItem('local_subscriptions');
    if (local && local !== 'undefined' && local !== 'null') {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error parsing local subscriptions:', e);
  }
  return [];
}

export async function unsubscribeNewsletter(token) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/subscriptions/${token}`);
    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.warn('Backend unsubscribe failed. Deleting locally:', error.message);
  }

  const localSubs = getLocalSubscriptionsSafe();
  const sub = localSubs.find(s => s.unsubscribeToken === token);
  if (!sub) {
    throw new Error('Subscription not found');
  }
  sub.isActive = false;
  localStorage.setItem('local_subscriptions', JSON.stringify(localSubs));
  return { success: true, message: 'Successfully unsubscribed (local)' };
}

export async function getSubscribersList() {
  const local = localStorage.getItem('local_subscriptions');
  if (local) {
    return getLocalSubscriptionsSafe();
  }
  const defaultMockSubs = [
    { _id: 'sub-1', email: 'reader1@naksh.com', isActive: true, preference: 'instant', createdAt: '2026-08-15T10:00:00Z' },
    { _id: 'sub-2', email: 'poems_love@gmail.com', isActive: true, preference: 'instant', createdAt: '2026-08-16T12:30:00Z' },
    { _id: 'sub-3', email: 'poetry_fan@yahoo.com', isActive: false, preference: 'instant', unsubscribeToken: 'token-3', createdAt: '2026-08-17T08:15:00Z' },
  ];
  localStorage.setItem('local_subscriptions', JSON.stringify(defaultMockSubs));
  return defaultMockSubs;
}
