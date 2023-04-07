import axios from 'axios';
import Bottleneck from 'bottleneck';

const rateLimiter = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 5,

  reservoir: 10,
  reservoirRefreshAmount: 10,
  reservoirRefreshInterval: 20 * 1000
});

const url = 'https://jsonplaceholder.typicode.com';

async function users(): Promise<any> {
  const response = await axios.get(`${url}/users`);
  return response.data;
}

async function posts(userId: string): Promise<any> {
  const response = await axios.get(`${url}/posts?userId=${userId}`);
  return response.data;
}

async function comments(postId: string): Promise<any> {
  const response = await axios.get(`${url}/comments?postId=${postId}`);
  return response.data;
}

export const throttledUsers = rateLimiter.wrap(users);
export const throttledPosts = rateLimiter.wrap(posts);
export const throttledComments = rateLimiter.wrap(comments);