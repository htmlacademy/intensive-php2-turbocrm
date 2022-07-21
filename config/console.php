<?php
$params = require(__DIR__ . '/params.php');

return [
    'id' => 'app-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'console\controllers',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'controllerMap' => [
        'fixture' => [
            'class' => 'yii\faker\FixtureController',
            'templatePath' => '@app/fixtures/templates',
            'fixtureDataPath' => '@app/fixtures/data',
            'namespace' => 'app\fixtures',
        ],
    ],
    'components' => [
        'db' => require(__DIR__ . '/db.php'),
        'log' => [
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
    ],
    'params' => $params,
];
