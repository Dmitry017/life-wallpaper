# Life Wallpaper for iPhone Shortcuts

## Deploy on Vercel

1. Create a new GitHub repo and upload this folder.
2. Import the repo into Vercel.
3. After deploy, use this URL pattern:

```text
https://YOUR-PROJECT.vercel.app/api/wallpaper?birthday=2002-04-23&age=70&width=1320&height=2868
```

## iPhone Shortcuts

1. Create a new automation in Shortcuts.
2. Add **Get Contents of URL** with your deployed URL.
3. Add **Set Wallpaper Photo** and choose Lock Screen.
4. Turn off **Ask Before Running**.

## Notes

- 1 dot = 1 week
- White dots = weeks already lived
- Orange dot = current week
- Gray dots = future weeks
- The endpoint returns SVG, which many Apple apps can render. If your Shortcuts flow refuses SVG directly, add a step that converts input to an image or use a small Cloudflare/Vercel image proxy later.
