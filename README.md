<h1>Project Status - remove when done</h1>
<ul>
<li>This is very early start , no coding is finish</li>
<li>Need to fix the types . it seems that the server action function should have
ServerActionArgs<T> as argument type and return R. some like

```ts
function withAuthHOF<T extends object, R>(
  serverAction: (params: ServerActionArgs<T>) => Promise<R>
) 
```

but need to use it all over and may be there are other options
</li>
<li>i have stop because i prefer to work on the API route solution whicj is what is have in post2youtube that use OAuth2 - step4Part1 = "/api/upload-video" </li>
</ul>

<h1>Project Name</h1>
<p>Next.js Server Actions with OAuth2 </p>

<h2>Project Description</h2>
<p>...</p>

<h2>Motivation</h2>
<p>How to elegantly and possibly genericly handle server actions with OAuth2 using axios \ fetch</p>

<h2>Installation</h2>
<p>...</p>

<h2>Usage</h2>
<p>...</p>

<h2>Design</h2>

<h3>1. Utility function to check and refresh token</h3>
todo nath : seems that its either OAuth2Client or redirectTo

```ts
function checkAndRefreshToken(): Promise<{
  oauth2Client: OAuth2Client | null;
  redirectTo?: string;
}>;
```

<h3>2. Generic HOF with server-side redirect</h3>

```ts
export function withAuthHOF(serverAction) {
    return async function (params) {
    const { oauth2Client, redirectTo } = await checkAndRefreshToken();
    if (redirectTo) {
        redirect(redirectTo);
        return null; // Redirection has already been handled
    }
    if (!oauth2Client) {
        return null; // Ensure function stops if redirection is needed 
        } 
        return await serverAction({ ...params, oauth2Client }); 
    }; 
    }
```

<h3>3. Specific server action wrapped with HOF</h3>

```ts
const videosAction = withAuthHOF(async function ({ oauth2Client }) {
     const videos = await getUserVideos(oauth2Client); 
     return videos; 
     }); 

```

<h3>4. Using the server action in a component:</h3>

```ts

export default async function VideosPage() {
  const videos = await videosAction();
  const videoCount = videos?.length || 0;

  return (
    <div>
      <h1>User Videos</h1>
      <p>Total videos: {videoCount}</p>
    </div>
  );
}
```

<h2>Technologies Used</h2>
<p>...</p>

<h2>Code Structure</h2>
<p>...</p>

<h2>Demo</h2>
<p>...</p>

<h2>Points of Interest</h2>
<ul>
    <li>...</li>
   
</ul>

<h2>References</h2>
<ul>
    <li>...</li>
   
</ul>
