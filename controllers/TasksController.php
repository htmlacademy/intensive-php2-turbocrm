<?php


namespace app\controllers;


use app\models\Task;

class TasksController extends EntityController
{
    public function init()
    {
        parent::init();

        $this->entity = new Task();
        $this->alias = 'tasks';
        $this->redirectAfterSaveUrl = \Yii::$app->request->getReferrer();
    }


}
