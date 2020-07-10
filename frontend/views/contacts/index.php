<?php
/** @var ActiveDataProvider $dataProvider */
/** @var $this \yii\web\View */
use yii\data\ActiveDataProvider;
use yii\data\Pagination;
use yii\grid\DataColumn;
use yii\grid\GridView;
use common\widgets\LinkPager;
use frontend\models\Contact;
use yii\widgets\ActiveForm;
use function morphos\Russian\pluralize;

$this->title = 'Список контактов';
?>
<section class="contacts-section">
    <div class="contacts-section__header">
        <h1 class="contacts-section__headline">Контакты</h1><a
                class="button button--tiny button--gray contacts-section__btn js-filters-toggler"
                href="#">Фильтровать</a><a class="button button--tiny contacts-section__btn modal-open" href="#">Добавить</a>
        <div class="contacts-section__search">
            <div class="search-block">
                <?php $form = ActiveForm::begin([
                    'method' => 'get',
                    'options' => ['class' => 'search-block__form']
                ]); ?>
                <?=$form->field($model, 'search', [
                    'template' => "{label}\n{input}",
                    'options' => ['class' => 'search-block__field-wrapper'],
                    'inputOptions' => ['class' => 'search-block__field', 'type' => 'search', 'placeholder' => 'Поиск']])
                    ->label('<span class="visually-hidden">Поле поиска</span>', ['class' => 'search-block__label']); ?>
                <button class="visually-hidden" type="submit">Найти</button>
                <?php ActiveForm::end(); ?>
            </div>
        </div>
        <div class="contacts-section__pagination-block-wrapper"><a
                    class="button button--tiny button--green contacts-section__btn" href="#">Экспорт XLS</a>
            <div class="contacts-section__pagination-block">
                <?=LinkPager::widget([
                    'options' => ['class' => 'pagination-block'],
                    'linkContainerOptions' => ['tag' => 'span'],
                    'disabledPageCssClass' => 'pagination-block__btn--disabled',
                    'nextPageCssClass' => 'pagination-block__btn pagination-block__btn--next',
                    'nextPageLabel' => '<svg width="7" height="12"><use xlink:href="/img/sprite.svg#next"></use></svg>',
                    'prevPageCssClass' => 'pagination-block__btn pagination-block__btn--prev',
                    'prevPageLabel' => '<svg width="7" height="12"><use xlink:href="/img/sprite.svg#next"></use></svg>',
                    'pagination' => $dataProvider->getPagination()
                ]); ?>
            </div>
        </div>
    </div>
    <?= $this->render('//partials/_grid_filter', ['model' => $model]); ?>
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
                    'value' => function() {
                        return $this->render('/partials/_action_row');
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
    <?= $this->render('//modals/_contact_form'); ?>
</section>
