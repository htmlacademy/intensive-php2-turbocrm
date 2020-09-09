<?php
/** @var $this View */
/** @var $model Feed */

use frontend\models\Deal;
use frontend\models\Feed;
use yii\web\View;

?>

<li class="deal-log__item event">
    <p class="event__data-block">
        <span class="event__data"><?=Yii::$app->formatter->asDate($model->dt_add, 'short')?></span>
        <time class="event__time"><?=Yii::$app->formatter->asTime($model->dt_add, 'short')?></time>
    </p>
    <div class="avatar event__avatar"><span>К</span></div>
    <div class="event__message-wrap"><b class="event__author"><?=$model->user->name; ?></b>
        <?php switch ($model->type): ?><?php case Feed::TYPE_NEW: ?>
        <span class="event__text">создал сделку, статус</span><span class="label label--new">Новая</span>
        <?php break; ?>
        <?php case Feed::TYPE_NOTE: ?>
            <span class="event__text">оставил заметку</span>
            <p class="event__message"><?=$model->getAssociatedContent()->content ?? null; ?></p>
        <?php endswitch; ?>
    </div>
</li>
