<?php

namespace frontend\controllers;

use yii\web\Controller;
use Yii;

class MessagesController extends Controller
{

    public function actionMail() {
        Yii::$app->cache->set($data, 'gmail_inbox_margo', 86400);
    }

}
