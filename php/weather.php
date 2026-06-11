<?php

header('Content-Type: application/json');

echo file_get_contents(
    'https://www.7timer.info/bin/civillight.php?lon=2.4&lat=48.9&ac=0&unit=metric&output=json&tzshift=0'
);

?>