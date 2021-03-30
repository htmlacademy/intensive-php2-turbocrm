<?php
/** @var ActiveDataProvider $dataProvider */
/** @var $this View */
/** @var $model Task */

use app\models\Task;
use yii\data\ActiveDataProvider;
use yii\grid\GridView;
use yii\web\View;
use function morphos\Russian\pluralize;

$this->title = 'Список задач';
?>
<section class="contacts-section">
    <?= $this->render('//partials/_grid_header', [
        'model' => $model, 'dataProvider' => $dataProvider, 'name' => 'Задачи', 'showFilterBtn' => false
    ]); ?>
    <div class="contacts-section__content">
        <?=GridView::widget([
            'dataProvider' => $dataProvider,
            'options' => ['class' => 'data-table'],
            'summary' => '',
            'layout' => "{summary}\n{items}",
            'columns' => [
                ['attribute' => 'dt_add', 'format' => 'date'],
                ['attribute' => 'type.name', 'label' => 'Тип'],
                ['attribute' => 'description'],
                ['attribute' => 'executor.name', 'label' => 'Исполнитель'],
                ['attribute' => 'due_date', 'format' => 'date'],
            ]]); ?>
    </div>
    <div class="contacts-section__footer">
        <ul class="data-summary">
            <li><?=pluralize($dataProvider->totalCount, 'задача'); ?></li>
            <li><?=pluralize(Task::getExpiredCount(), 'просроченный'); ?></li>
        </ul>
    </div>
</section>
