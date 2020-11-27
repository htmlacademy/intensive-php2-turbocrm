<?php


namespace frontend\controllers;


use frontend\models\Deal;
use frontend\models\Task;

class TasksController extends TableController
{
    public function init()
    {
        parent::init();

        $this->entity = new Task();
        $this->alias = 'tasks';
        $this->redirectAfterSaveUrl = \Yii::$app->request->getReferrer();
    }


}
