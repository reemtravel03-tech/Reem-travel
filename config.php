<?php
/**
 * Contact form settings — edit these before uploading.
 */
return [
    // Where contact form messages are delivered
    'to_email'   => 'reemtravel03@gmail.com',

    // Sender shown in the email. With SMTP below enabled, Gmail always sends
    // from the SMTP account, so this is only used when SMTP is disabled.
    // Must be an address ON YOUR OWN DOMAIN (e.g. no-reply@reemtravel.com).
    'from_email' => 'no-reply@reemtravel.com',
    'from_name'  => 'Reem Travel Website',

    'subject'    => 'New message from Reem Travel website',

    /*
     * SMTP — OFF: the site uses PHP mail(), which works on normal hosting with no password.
     * Only turn this on if your host blocks mail(). For Gmail:
     *   1. Turn on 2-Step Verification on the Google account.
     *   2. Create an App Password: https://myaccount.google.com/apppasswords
     *   3. Paste the 16-character app password below (NOT your normal Gmail password).
     * Set 'enabled' => false to use PHP mail() instead (works on most shared hosting).
     */
    'smtp' => [
        'enabled'  => false,
        'host'     => 'smtp.gmail.com',
        'port'     => 465,
        'secure'   => 'ssl',        // 'ssl' for port 465, 'tls' for port 587
        'username' => 'reemtravel03@gmail.com',
        'password' => '',           // ← paste your Gmail App Password here
    ],

    // Anti-spam
    'min_seconds_to_submit' => 3,   // bots submit instantly
    'rate_limit_seconds'    => 60,  // one message per visitor per minute
];
