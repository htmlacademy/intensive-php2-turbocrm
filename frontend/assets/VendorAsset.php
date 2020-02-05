<?php

namespace frontend\assets;
use yii\web\AssetBundle;

class VendorAsset extends AssetBundle
{
    public $sourcePath = '@npm/moment/min';

    public $js = [
        'moment.min.js',
    ];
}
