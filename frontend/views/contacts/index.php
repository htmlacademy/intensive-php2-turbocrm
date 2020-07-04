<?php
/** @var ActiveDataProvider $dataProvider */
/** @var $this \yii\web\View */
use yii\data\ActiveDataProvider;
use yii\data\Pagination;
use yii\grid\DataColumn;
use yii\grid\GridView;
use common\widgets\LinkPager;

$this->title = 'Список контактов';
?>
<section class="contacts-section">
    <div class="contacts-section__header">
        <h1 class="contacts-section__headline">Контакты</h1><a
                class="button button--tiny button--gray contacts-section__btn js-filters-toggler"
                href="#">Фильтровать</a><a class="button button--tiny contacts-section__btn modal-open" href="#">Добавить</a>
        <div class="contacts-section__search">
            <div class="search-block">
                <form class="search-block__form" action="#" method="post">
                    <div class="search-block__field-wrapper"><label class="search-block__label"
                                                                    for="trade-search-field"><span
                                    class="visually-hidden">Поле поиска</span>
                            <svg width="16" height="16">
                                <use xlink:href="/img/sprite.svg#zoom"></use>
                            </svg>
                        </label><input class="search-block__field" id="trade-search-field" type="search"
                                       placeholder="Поиск">
                        <button class="visually-hidden" type="submit">Найти</button>
                    </div>
                </form>
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
    <div class="contacts-section__filters js-filters">
        <div class="filters-block">
            <form class="filters-block__form" action="#" method="post">
                <div class="filters-block__field field field--select field--small"><label class="field__label"
                                                                                          for="status-selection">Cтатус</label><select
                            class="field__select select" id="status-selection">
                        <option value="0" placeholder>Новый</option>
                        <option value="1">Не новый</option>
                    </select></div>
                <div class="filters-block__field field field--select"><select class="field__select select">
                        <option value="0" placeholder>Компания</option>
                        <option value="1">Не компания</option>
                    </select></div>
                <button class="filters-block__btn button button--normal" type="submit">Применить</button>
            </form>
            <button class="filters-block__close button button--icon js-filters-toggler" type="button">
                <svg width="24" height="24">
                    <use xlink:href="/img/sprite.svg#x-circle"></use>
                </svg>
            </button>
        </div>
    </div>
    <div class="contacts-section__content">
        <?=GridView::widget([
            'dataProvider' => $dataProvider,
            'options' => ['class' => 'data-table'],
            'summary' => '',
            'layout' => "{summary}\n{items}",
//            'filterModel' => $model,
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
            <li>648 контакта</li>
            <li>312 активных</li>
            <li>15 новых</li>
        </ul>
    </div>
    <?= $this->render('//modals/_contact_form'); ?>
</section>
