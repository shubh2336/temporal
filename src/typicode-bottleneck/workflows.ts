import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

interface hasId { id: number };
interface hasIdAndEmail extends hasId { email: string };

const { throttledUsers } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minute',
});

const { throttledPosts } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minute',
});

const { throttledComments } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minute',
});


/** A workflow that simply calls an activity */
export async function typicodeThrottle(arg: string): Promise<string> {
  const userResp = await throttledUsers();
  console.log(`Got ${userResp.length} users from the API`);

  await Promise.all(
    userResp.map(async (user: hasIdAndEmail) => {
      const postResp = await throttledPosts(user.id.toString());
      console.log(`ID (${user.id}) ${user.email} has ${postResp.length} posts`);

      await Promise.all(
        postResp.map(async (post: hasId) => {
          const commentResp = await throttledComments(post.id.toString());
          console.log(`ID (${user.id}) ${user.email}'s post ID (${post.id}) has ${commentResp.length} comments`);
        })
      )
    })
  );

  // Non-determinism??
  // for await (const user of userResp) {
  //   const postResp = await throttledPosts(user.id.toString());
  //   console.log(`ID (${user.id}) ${user.email} has ${postResp.length} posts`);

  //   for await (const post of postResp) {
  //     const commentResp = await throttledComments(post.id.toString());
  //     console.log(`ID (${user.id}) ${user.email}'s post ID (${post.id}) has ${commentResp.length} comments`);
  //   }
  // }

  return 'done!';
};
