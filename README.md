
<h1>Project Name</h1>
 Next.js server actions with OAuth2 , YouTube API and refresh tokens 

<h2>Project Description</h2>
This Next.js App Router Project uses the YouTube API on the server for 
<ul>
<li>Uploading video to your YouTube channel</li>
<li>Get number of videos in your YouTube channel</li>
</ul>
It utilizes server actions , OAuth2 , iron session , refresh token , suspense and HOF (High Order Function)

<h2>Motivation</h2>
I allready have a solution of pages router project with api routes based solution for handling in next.js OAuth2 + YouTube API + refresh token <a id='reference1'>[1]</a> . But how to do it with server actions instead of api routes ? the solution is in this repo

<h2>Installation</h2>

<h3>Dependencies</h3>
Invoke the following to install all dependencies

```ts
pnpm i
``` 

npm is also possible

<h3>Google Cloud Console Project</h3>
  <ol>
    <li>Create a Google Cloud Console project.</li>
    <li>Enable Google API.</li>
    <li>Use OAuth2.</li>
    <li>Add scopes according to SCOPES constant in the project</li>
  </ol>

 
<h3>.env.local</h3>

This file is in .gitignore. You can get GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET from the credentails file in google cloud project

The following is an immage of the .env.local file 
<img src='./figs/env-local.png'/>

<h3>Scopes</h3>

```ts
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload", // required for youtube.videos.insert and youtube.thumbnails.set,
  "https://www.googleapis.com/auth/youtube.readonly", // -- require to get video list
  "https://www.googleapis.com/auth/userinfo.profile", // -- require to get user profile
  "https://www.googleapis.com/auth/userinfo.email", // -- require to get user email
];
```


<h2>Usage</h2>
Run the devlopment server using

```bash
npm run dev
```

<h2>Design</h2>
The design that is new in this repo had four ingredients  

<h3>1. Utility function for refresh token and redirect</h3>

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
withAuthHOF injects authenticated oauth2 object  

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

 The following is an image of the home page with buttons 
 <ul>
 <li><strong>UploadVideo</strong> : navigate to server component under app/upload-video and upload video from data folder to your YouTube channel</li>
 <li><strong>Get number of videos</strong> : navigate to server component under app/videos and get number of videos in your YouTube channel (limited to 10)</li>
 <li><strong>Debug clear iron session</strong> : using this invalidate the oauth2 object</li>
  <li><strong>Switch user</strong> : choose gmail account of your YouTube account to authenticate to</li>
 </ul>
 The authenticated user info is also presented

 <img src='./figs/index.png'/>



<h2>Points of Interest</h2>
<ul>
    <li>'Debug clear iron session' is actually logout while 'Switch user' is login</li>
</ul>

<h2>References</h2>
<ol>
    <li id='reference1'><a href='https://www.youtube.com/watch?v=jD6u7X2rYew'>Next.js YouTube API Tutorial: Authentication and Refresh Token</a></li>
</ol>
