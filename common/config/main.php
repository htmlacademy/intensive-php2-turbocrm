<?php
return [
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'language' => 'ru-RU',
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'components' => [
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'enableStrictParsing' => false,
            'rules' => [
                '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                'persons' => 'contacts/index',
                'contacts/status/<status:\w+>' => 'contacts/filter',
                ['class' => 'yii\rest\UrlRule', 'controller' => 'api/contacts']
            ]
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
    ],
];
