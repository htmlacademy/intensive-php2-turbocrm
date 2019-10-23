<?php
/** @var ActiveDataProvider $dataProvider */
use yii\data\ActiveDataProvider;
use yii\grid\GridView;
?>
<h1>Контакты</h1>

<div class="contacts-section__content">
    <?=GridView::widget(['dataProvider' => $dataProvider, 'filterModel' => $model, 'columns' => [
        ['class' => 'yii\grid\CheckboxColumn'],
        ['attribute' => 'name'],
        ['attribute' => 'company.name', 'label' => 'Компания'],
        ['attribute' => 'position'],
        ['attribute' => 'phone'],
        ['attribute' => 'email', 'format' => 'email'],
        ['attribute' => 'dt_add', 'label' => 'Добавлен', 'format' => 'date']
    ]]); ?>
</div>
