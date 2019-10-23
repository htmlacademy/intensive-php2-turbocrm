<?php
/** @var ActiveDataProvider $dataProvider */
use yii\data\ActiveDataProvider;
use yii\grid\GridView;
?>
<h1>Контакты</h1>

<div class="contacts-section__content">
    <?=GridView::widget(['dataProvider' => $dataProvider]); ?>
</div>
