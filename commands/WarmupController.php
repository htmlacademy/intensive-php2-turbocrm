<?php
namespace console\controllers;

use yii\console\Controller;
use yii\helpers\Console;

class WarmupController extends Controller
{
    public function actionGmail($user = null)
    {
        $this->stdout("Cache warmup command for user: $user\n", Console::BOLD);
        return 0;
    }
}
