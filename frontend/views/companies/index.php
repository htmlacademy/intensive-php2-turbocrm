<?php

/** @var ActiveDataProvider $dataProvider */
/** @var $this View */

/** @var $model Company */

use frontend\models\Company;
use frontend\widgets\Notification;
use yii\data\ActiveDataProvider;
use yii\grid\DataColumn;
use yii\grid\GridView;
use frontend\models\Contact;
use yii\web\View;
use function morphos\Russian\pluralize;

$this->title = 'Список компаний';
?>
<section class="contacts-section">
    <?= $this->render('//partials/_grid_header', [
        'model' => $model, 'dataProvider' => $dataProvider, 'name' => 'Компании', 'showFilterBtn' => false
    ]); ?>
    <div class="contacts-section__content">
        <?= GridView::widget([
            'dataProvider' => $dataProvider,
            'options' => ['class' => 'data-table'],
            'summary' => '',
            'layout' => "{summary}\n{items}",
            'columns' => [
                ['attribute' => 'name'],
                ['attribute' => 'address'],
                ['attribute' => 'phone'],
                ['attribute' => 'url', 'format' => 'url'],
                ['attribute' => 'email', 'format' => 'email'],
                [
                    'class' => DataColumn::class,
                    'value' => function () {
                        return $this->render('/partials/_action_row');
                    },
                    'header' => '', 'label' => '', 'format' => 'raw'
                ]
            ]]); ?>
    </div>
    <div class="contacts-section__footer">
        <ul class="data-summary">
            <li><?= pluralize($dataProvider->totalCount, 'компания'); ?></li>
        </ul>
    </div>
    <?= $this->render('//modals/_company_form', ['model' => $model]); ?>
    <?= Notification::widget([
        'flashName' => 'companies_create',
        'title' => 'Новая компания успешно добавлена.'
    ]); ?>
</section>
