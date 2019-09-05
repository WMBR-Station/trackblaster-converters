<?php

if (preg_match('/\.(?:js|html)$/', $_SERVER["REQUEST_URI"])) {
    return false;    // serve the requested resource as-is.
}

?>
