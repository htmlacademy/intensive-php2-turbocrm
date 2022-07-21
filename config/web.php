<?php
$params = require(__DIR__ . '/params.php');

return [
    'id' => 'turbocrm',
    'basePath' => dirname(__DIR__),
    'layout' => 'common',
    'language' => 'ru-RU',
    'bootstrap' => ['log'],
    'vendorPath' => dirname(__DIR__) . '/vendor',
    'defaultRoute' => 'landing/index',
    'modules' => [
        'api' => [
            'class' => 'app\modules\api\Module'
        ]
    ],
    'components' => [
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
                [
                    'class' => 'yii\log\EmailTarget',
                    'levels' => ['error'],
                    'message' => [
                        'to' => ['admin@example.com'],
                        'subject' => 'Ошибки на сайте turbocrm',
                    ],
                ],
                [
                    'class' => 'yii\log\DbTarget',
                    'levels' => ['info']
                ],
            ],
        ],
        'request' => [
            'cookieValidationKey' => '9fs$(8423nklj24pjlkfds298',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
            'csrfParam' => '_csrf-frontend',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => true,
            'identityCookie' => ['name' => '_identity-frontend', 'httpOnly' => true],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'db' => require(__DIR__ . '/db.php'),
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'enableStrictParsing' => false,
            'rules' => [
                ['class' => 'yii\rest\UrlRule', 'controller' => 'api/contacts'],
                '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                'persons' => 'contacts/index',
                'contacts/status/<status:\w+>' => 'contacts/filter'
            ]
        ],
        'cache' => [
            'class' => 'yii\redis\Cache',
        ],
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => 'localhost',
            'port' => 6379,
            'database' => 0,
        ],
    ],
    'params' => $params,
];
