import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com';

export async function users(): Promise<any> {
  const response = await axios.get(`${url}/users`);
  return response.data;
}

export async function posts(userId: string): Promise<any> {
  const response = await axios.get(`${url}/posts?userId=${userId}`);
  return response.data;
}

export async function comments(postId: string): Promise<any> {
  const response = await axios.get(`${url}/comments?postId=${postId}`);
  return response.data;
}
