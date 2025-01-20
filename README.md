
<h1>Project Name</h1>
 Next.js server actions with OAuth2 , YouTube API and refresh tokens 

<h2>Project Description</h2>
This Next.js App Router Project uses the YouTube API from the server for 
<ul>
<li>uploading video to your YouTube channel</li>
<li>get number of videos in your YouTube channel</li>
</ul>
It utilizes server actions , OAuth2 , iron session , refresh token , suspense and HOF (High Order Function)

<h2>Motivation</h2>
I allready have a solution of pages router project with api routes based solution for handling in next.js OAuth2 + YouTube API + refresh token <a id='reference1'>[1]</a> . But how to do it with server actions instead of api routes ? the solution is i this repo

<h2>Installation</h2>


pnpm i 

<h3>google cloud project</h3>
...........
 
<h3>.env.local</h3>

This file is in .gitignore
<img src='./figs/env-local.png'/>

<h3>scopes</h3>
........

<h2>Usage</h2>
...

<h2>Design</h2>

<h3>1. Utility function to check and refresh token</h3>

```ts
function checkAndRefreshToken(): Promise<{
  oauth2Client: OAuth2Client | null;
  redirectTo?: string;
}>;
```

<h3>2. Generic HOF with server-side redirect</h3>

```ts
export function withAuthHOF<T extends object, R>(
  serverAction: (params: ServerActionArgs<T>) => Promise<R>
) {
  return async function (params: T) {
    const { oauth2Client, redirectTo } = await checkAndRefreshToken();
    if (redirectTo) {
      redirect(redirectTo);
      //return null; // Redirection has already been handled
    }
    if (!oauth2Client) {
      throw new Error("OAuth2 client not available. Authentication failed but missing redirectTo");
    }
    const augmentedParams: ServerActionArgs<T> = { ...params, oauth2Client };
    return await serverAction(augmentedParams);
  };
}
```

<h3>3. Specific server action wrapped with HOF</h3>

```ts
const getUserVideosWithAuth = withAuthHOF<UserVideosParams, UserVideosResult>(
  getUserVideos
);
```

<h3>4. Use the server action in a component:</h3>
Here is a simplified usage without handling error and loading

```ts
const VideosPage: FC = async () => {
  const videos = await getUserVideosWithAuth({});
  const videoCount = videos?.length || 0;

  return (
    <div>
      <h1>User Videos</h1>
      <p>Total videos: {videoCount}</p>
    </div>
  );
};
```


<h2>Demo</h2>
...

<h2>Points of Interest</h2>
<ul>
    <li>...</li>
   
</ul>

<h2>References</h2>
<ol>
    <li id='reference1'><a href='https://www.youtube.com/watch?v=jD6u7X2rYew'>Next.js YouTube API Tutorial: Authentication and Refresh Token</a></li>
   
</ol>
