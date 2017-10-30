<?php
function get_lyrics($path) {
  $url = sprintf('https://genius.com/%s',$path);
  $resp = file_get_contents($url);
  echo base64_encode($resp);
}
parse_str($_SERVER['QUERY_STRING']);
if ($method == 'get_lyrics') {
  get_lyrics(base64_decode($path));
}

?>
