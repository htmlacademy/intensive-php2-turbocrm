<?php


namespace frontend\widgets;


use frontend\models\Feed;

class FeedItem extends \yii\base\Widget
{
    /**
     * @var Feed
     */
    public $model;

    public function run()
    {
        return $this->render('feed', ['model' => $this->model]);
    }


}
