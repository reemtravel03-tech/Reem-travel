<?php
/**
 * Reem Travel — contact form handler.
 * Receives the form POST, validates it and emails it to the address in config.php
 * using PHP's mail(). Returns JSON for the fetch() call in assets/js/main.js,
 * or redirects back to the page when JavaScript is disabled.
 */
declare(strict_types=1);

$config = require __DIR__ . '/config.php';
$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, int $status, string $code, bool $wantsJson): never
{
    if ($wantsJson) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'code' => $code]);
    } else {
        header('Location: index.html?sent=' . ($ok ? '1' : '0') . '#contact', true, 303);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(false, 405, 'method', $wantsJson);
}

// Strip line breaks from anything that could end up in a header (header-injection guard)
$clean = static fn(string $v): string => trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v));

$name    = $clean((string)($_POST['name'] ?? ''));
$email   = $clean((string)($_POST['email'] ?? ''));
$phone   = $clean((string)($_POST['phone'] ?? ''));
$service = $clean((string)($_POST['service'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$lang    = ($_POST['lang'] ?? 'ar') === 'en' ? 'en' : 'ar';

// --- Spam checks: honeypot, time-to-submit, per-session rate limit ---
if (!empty($_POST['website'])) {
    respond(true, 200, 'ok', $wantsJson); // pretend success so bots move on
}
$ts = (int)($_POST['ts'] ?? 0);
if ($ts > 0 && (time() * 1000 - $ts) < $config['min_seconds_to_submit'] * 1000) {
    respond(true, 200, 'ok', $wantsJson);
}

session_start();
$last = $_SESSION['reem_last_contact'] ?? 0;
if (time() - $last < $config['rate_limit_seconds']) {
    respond(false, 429, 'rate', $wantsJson);
}

// --- Validation ---
$len = static fn(string $v): int => function_exists('mb_strlen') ? mb_strlen($v) : strlen($v);
if ($name === '' || $len($name) > 100
    || !filter_var($email, FILTER_VALIDATE_EMAIL) || $len($email) > 150
    || $message === '' || $len($message) > 3000
    || $len($phone) > 30 || $len($service) > 100) {
    respond(false, 422, 'invalid', $wantsJson);
}

// --- Build the email (HTML + plain text) ---
$e = static fn(string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$sentAt = date('Y-m-d H:i');
$ip = $_SERVER['REMOTE_ADDR'] ?? '';

$rows = [
    'Name / الاسم'        => $e($name),
    'Email / البريد'      => '<a href="mailto:' . $e($email) . '">' . $e($email) . '</a>',
    'Phone / الهاتف'      => $phone !== '' ? '<a href="tel:' . $e($phone) . '">' . $e($phone) . '</a>' : '—',
    'Service / الخدمة'    => $service !== '' ? $e($service) : '—',
    'Language / اللغة'    => $lang === 'ar' ? 'العربية' : 'English',
];
$rowsHtml = '';
foreach ($rows as $label => $value) {
    $rowsHtml .= '<tr><td style="padding:10px 14px;color:#5a6476;font-size:13px;width:150px;border-bottom:1px solid #eee">'
        . $label . '</td><td style="padding:10px 14px;font-size:15px;border-bottom:1px solid #eee">' . $value . '</td></tr>';
}

$html = '<!doctype html><html><body style="margin:0;background:#f7f3ec;font-family:Arial,sans-serif">'
    . '<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden">'
    . '<div style="background:#0a1d3a;color:#fff;padding:24px"><div style="color:#e9b22c;font-size:12px;letter-spacing:2px">REEM TRAVEL</div>'
    . '<div style="font-size:20px;margin-top:6px">New contact form message</div></div>'
    . '<table style="width:100%;border-collapse:collapse">' . $rowsHtml . '</table>'
    . '<div style="padding:20px 14px"><div style="color:#5a6476;font-size:13px;margin-bottom:8px">Message / الرسالة</div>'
    . '<div style="font-size:15px;line-height:1.7;white-space:pre-wrap" dir="auto">' . nl2br($e($message)) . '</div></div>'
    . '<div style="padding:14px;color:#999;font-size:11px;border-top:1px solid #eee">Sent ' . $sentAt . ' · IP ' . $e($ip) . '</div>'
    . '</div></body></html>';

$text = "New contact form message\n\n"
    . "Name: $name\nEmail: $email\nPhone: " . ($phone ?: '-') . "\nService: " . ($service ?: '-') . "\n\n"
    . "Message:\n$message\n\nSent $sentAt from $ip\n";

$boundary = 'b_' . bin2hex(random_bytes(12));
$encodeHeader = static fn(string $v): string => '=?UTF-8?B?' . base64_encode($v) . '?=';

$smtp = $config['smtp'] ?? ['enabled' => false];
$fromEmail = !empty($smtp['enabled']) ? $smtp['username'] : $config['from_email'];

$headers = [
    'MIME-Version: 1.0',
    'From: ' . $encodeHeader($config['from_name']) . ' <' . $fromEmail . '>',
    'Reply-To: ' . $encodeHeader($name) . ' <' . $email . '>',
    'X-Mailer: PHP/' . PHP_VERSION,
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
];

$body = "--$boundary\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($text)) . "\r\n"
    . "--$boundary\r\n"
    . "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($html)) . "\r\n"
    . "--$boundary--";

$subject = $encodeHeader($config['subject'] . ' — ' . $name);

if (!empty($smtp['enabled'])) {
    try {
        smtp_send($smtp, $fromEmail, $config['to_email'], $subject, $headers, $body);
        $sent = true;
    } catch (RuntimeException $ex) {
        error_log('[contact.php] SMTP failed: ' . $ex->getMessage());
        $sent = false;
    }
} else {
    // -f sets the envelope sender; many shared hosts require it for delivery
    $sent = @mail($config['to_email'], $subject, $body, implode("\r\n", $headers), '-f' . $fromEmail);
    if (!$sent) {
        error_log('[contact.php] mail() failed for message from ' . $email);
    }
}

if (!$sent) {
    respond(false, 500, 'mail', $wantsJson);
}

$_SESSION['reem_last_contact'] = time();
respond(true, 200, 'ok', $wantsJson);

/**
 * Minimal SMTP client (AUTH LOGIN over SSL or STARTTLS), enough for Gmail
 * and typical hosting mail servers. Throws RuntimeException on any failure.
 */
function smtp_send(array $smtp, string $from, string $to, string $subject, array $headers, string $body): void
{
    if (($smtp['password'] ?? '') === '') {
        throw new RuntimeException('SMTP password is empty in config.php');
    }

    $secure = $smtp['secure'] ?? 'ssl';
    $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $smtp['host'] . ':' . (int)$smtp['port'];
    $sock = @stream_socket_client($remote, $errno, $errstr, 15);
    if (!$sock) {
        throw new RuntimeException("Connect to $remote failed: $errstr ($errno)");
    }
    stream_set_timeout($sock, 15);

    $expect = static function (array $codes) use ($sock): string {
        $reply = '';
        while (($line = fgets($sock, 515)) !== false) {
            $reply .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') {
                break; // last line of a (possibly multi-line) reply
            }
        }
        if (!in_array((int)substr($reply, 0, 3), $codes, true)) {
            throw new RuntimeException('Unexpected SMTP reply: ' . trim($reply));
        }
        return $reply;
    };
    $send = static function (string $cmd, array $codes) use ($sock, $expect): string {
        fwrite($sock, $cmd . "\r\n");
        return $expect($codes);
    };

    $hostname = gethostname() ?: 'localhost';
    $expect([220]);
    $send("EHLO $hostname", [250]);
    if ($secure === 'tls') {
        $send('STARTTLS', [220]);
        if (!stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('STARTTLS negotiation failed');
        }
        $send("EHLO $hostname", [250]);
    }
    $send('AUTH LOGIN', [334]);
    $send(base64_encode($smtp['username']), [334]);
    $send(base64_encode($smtp['password']), [235]);
    $send("MAIL FROM:<$from>", [250]);
    $send("RCPT TO:<$to>", [250, 251]);
    $send('DATA', [354]);

    $message = implode("\r\n", array_merge([
        'Date: ' . date('r'),
        'To: <' . $to . '>',
        'Subject: ' . $subject,
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . explode('@', $from)[1] . '>',
    ], $headers)) . "\r\n\r\n" . $body;
    // normalise line endings and dot-stuff lines that start with "."
    $message = preg_replace('/\r?\n/', "\r\n", $message);
    $message = preg_replace('/^\./m', '..', $message);

    fwrite($sock, $message . "\r\n.\r\n");
    $expect([250]);
    $send('QUIT', [221]);
    fclose($sock);
}
