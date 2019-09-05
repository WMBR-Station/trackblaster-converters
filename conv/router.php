<?php
$request = $_SERVER['REQUEST_URI'];

function get_lyrics($path) {
    $url = sprintf('https://genius.com/%s',$path);
    $resp = file_get_contents($url);
    echo base64_encode($resp);
}

if (preg_match('/\.(?:js|html)$/', $request)) {
    return false;    // serve the requested resource as-is.
}
else{
    preg_match('/\/[^\/]+\?/', $request, $matches);
    $handle = $matches[0];
    switch($handle){
    case '/get_lyrics?':
        $query = parse_str($_SERVER['QUERY_STRING']);
        get_lyrics(base64_decode($path));
        break;
    default:
        echo "UNKNOWN REQUEST:";
        echo $request;
        break;
    }
}
?>
