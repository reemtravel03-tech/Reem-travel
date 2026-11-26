# Reem Travel — 2026 website

A static, bilingual (Arabic RTL / English LTR) one-page site with a PHP contact form.
No build step and no Node. Upload the files to any PHP host (Hostinger, cPanel, etc.).

```
index.html          home page (Arabic text lives here)
about.html          About us + How we work + FAQ page
videos.html         Travel videos page (cinematic, dark theme)
assets/video/       the 3 videos (video-1..3.mp4) + their poster images
assets/css/style.css
assets/js/main.js   animations, language switch (English text lives here), form submit
assets/img/         optimized images from the original repo
contact.php         receives the form and emails it with PHP mail()
config.php          recipient / sender email settings, edit before uploading
```

## Email setup (`config.php`)
- `to_email`: the inbox that receives messages.
- **SMTP (on by default)**: sends through Gmail's mail server. This works on XAMPP and on any host.
  1. Turn on 2-Step Verification for the Gmail account.
  2. Create an App Password at https://myaccount.google.com/apppasswords
  3. Paste the 16-character App Password into `'password' => ''`.
- To use the host's PHP `mail()` instead, set `'enabled' => false`. `from_email` must then be on the site's own domain.
- If sending fails, the reason is written to the PHP error log (on XAMPP: `C:\xampp\apache\logs\error.log`, lines that start with `[contact.php]`).

## Testing locally with XAMPP
The site is copied to `C:\xampp\htdocs\reem-travel`. Start Apache in the XAMPP Control Panel and open http://localhost/reem-travel/

## Going live
Upload everything to `public_html/` and send a test message from the live site.

Requires PHP 8.1+.

## Editing text
- Arabic: edit it directly in `index.html`.
- English: edit the `EN` object at the top of `assets/js/main.js` (same `data-i18n` keys).
