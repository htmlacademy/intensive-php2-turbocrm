<?php
/** @var ActiveDataProvider $dataProvider */
/** @var $this View */
/** @var $searchModel Contact */
/** @var $model Contact */

use frontend\widgets\Notification;
use yii\data\ActiveDataProvider;
use yii\grid\DataColumn;
use yii\grid\GridView;
use frontend\models\Contact;
use yii\web\JqueryAsset;
use yii\web\View;
use function morphos\Russian\pluralize;

$this->title = 'Список контактов';
$this->registerJsFile('@web/js/grid.js', ['depends' => [JqueryAsset::class]]);

?>
<section class="contacts-section">
    <?= $this->render('//partials/_grid_header', [
        'model' => $searchModel, 'dataProvider' => $dataProvider, 'name' => 'Контакты', 'showFilterBtn' => true
    ]); ?>
    <?= $this->render('//partials/_grid_filter', ['model' => $searchModel]); ?>
    <div class="contacts-section__content">
        <?=GridView::widget([
            'dataProvider' => $dataProvider,
            'options' => ['class' => 'data-table'],
            'summary' => '',
            'layout' => "{summary}\n{items}",
            'columns' => [
                ['attribute' => 'name'],
                ['attribute' => 'company.name', 'label' => 'Компания'],
                ['attribute' => 'position'],
                ['attribute' => 'status.name', 'label' => 'Тип'],
                ['attribute' => 'phone'],
                ['attribute' => 'email', 'format' => 'email'],
                [
                    'class' => DataColumn::class,
                    'value' => function($row) {
                        return $this->render('/partials/_action_row', ['alias' => 'contacts', 'id' => $row->id]);
                    },
                    'header' => '', 'label' => '', 'format' => 'raw'
                ]
        ]]); ?>
    </div>
    <div class="contacts-section__footer">
        <ul class="data-summary">
            <li><?=pluralize($dataProvider->totalCount, 'контакт'); ?></li>
            <li><?=pluralize(Contact::getItemsCountByStatus('Активный'), 'активный'); ?></li>
            <li><?=pluralize(Contact::getItemsCountByStatus('Новый'), 'новый'); ?></li>
        </ul>
    </div>
    <?= $this->render('//modals/_contact_form', ['model' => $model]); ?>
    <?= Notification::widget([
        'flashName' => 'persons_create',
        'title' => 'Новый контакт успешно добавлен.'
    ]); ?>
</section>
