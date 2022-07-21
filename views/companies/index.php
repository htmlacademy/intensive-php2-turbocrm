<?php

/** @var ActiveDataProvider $dataProvider */
/** @var $this View */

/** @var $model Company */
/** @var $searchModel Company */

use app\models\Company;
use app\widgets\Notification;
use yii\data\ActiveDataProvider;
use yii\grid\DataColumn;
use yii\grid\GridView;
use app\models\Contact;
use yii\web\JqueryAsset;
use yii\web\View;
use function morphos\Russian\pluralize;

$this->title = 'Список компаний';
$this->registerJsFile('@web/js/grid.js', ['depends' => [JqueryAsset::class]]);

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
                    'value' => function ($row) {
                        return $this->render('/partials/_action_row', ['alias' => 'companies', 'id' => $row->id]);
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
