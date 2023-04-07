import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

interface hasId { id: number };
interface hasIdAndEmail extends hasId { email: string };

const { users } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

const { posts } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

const { comments } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});


/** A workflow that simply calls an activity */
export async function typicode(arg: string): Promise<string> {
  const userResp = await users();
  console.log(`Got ${userResp.length} users from the API`);

  // // Sequential Hits
  // for await (const user of userResp) {
  //   const postResp = await posts(user.id.toString());
  //   console.log(`Got ${postResp.length} posts for user ${user.email}`);

  //   for await (const post of postResp) {
  //     const commentResp = await comments(post.id.toString());
  //     console.log(`Got ${commentResp.length} comments for post ${post.id} of user ${user.email}`);
  //   }
  // }

  // Parallel hits
  await Promise.all(
    userResp.map(async (user: hasIdAndEmail) => {
      const postResp = await posts(user.id.toString());
      console.log(`${user.id} ${user.email} has ${postResp.length} posts`);

      await Promise.all(
        postResp.map(async (post: hasId) => {
          const commentResp = await comments(post.id.toString());
          console.log(`${user.id} ${user.email}'s post ID (${post.id}) has ${commentResp.length} comments`);
        })
      )
    })
  );

  return 'done!';
};
