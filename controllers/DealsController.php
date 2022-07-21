<?php

namespace app\controllers;

use app\models\Deal;
use app\models\DealStatus;
use app\models\Feed;
use app\models\Note;
use yii\web\NotFoundHttpException;

class DealsController extends EntityController
{
    public function init()
    {
        parent::init();

        $this->entity = new Deal;
        $this->alias = 'deals';
    }

    public function actionIndex($id = null)
    {
        $dealStatuses = DealStatus::find()->all();

        return $this->render('index', ['statuses' => $dealStatuses]);
    }

    public function actionNext($id)
    {
        return $this->changeStatus($id, 'next');
    }

    public function actionPrev($id)
    {
        return $this->changeStatus($id, 'prev');
    }

    public function actionView($id)
    {
        $deal = Deal::findOne($id);
        $note = new Note();

        if (!$deal || $deal->deleted) {
            throw new NotFoundHttpException("Сделка с этим ID не найдена");
        }

        if (\Yii::$app->request->isPost) {
            $note->load(\Yii::$app->request->post());
            $note->save();

            $deal->link('notes', $note);
            $note->content = null;
        }

        return $this->render('view', ['deal' => $deal, 'note' => $note]);
    }

    public function actionSave($id)
    {
        $deal = Deal::findOne($id);

        if ($deal) {
            $deal->load(\Yii::$app->request->post());
            $deal->save();
        }
    }

    private function changeStatus($id, $direction)
    {
        $deal = Deal::findOne($id);
        $status = null;

        if (!$deal) {
            throw new NotFoundHttpException("Сделка с этим ID не найдена");
        }

        if ($direction === 'next') {
            $status = $deal->status->getNextStatus();
        }
        else if ($direction === 'prev') {
            $status = $deal->status->getPrevStatus();
        }

        if ($status) {
            $deal->link('status', $status);

            $feed = new Feed();
            $feed->setAttributes(['type' => Feed::TYPE_STATUS, 'value' => $status->id, 'deal_id' => $deal->id]);
            $feed->save();
        }

        return $this->redirect(['deals/view', 'id' => $id]);
    }

}
