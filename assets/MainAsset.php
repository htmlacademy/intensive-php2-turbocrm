<?php

namespace app\assets;
use yii\web\AssetBundle;

class MainAsset extends AssetBundle
{
    public $basePath = '@app';

    public $css = [
        'css/style.css'
    ];

    public $js = [
        'js/main.js'
    ];

    public $depends = [
        'yii\web\JqueryAsset', 'app\assets\VendorAsset'
    ];
}
