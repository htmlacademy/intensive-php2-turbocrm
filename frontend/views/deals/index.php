<?php
/** @var ActiveDataProvider $dataProvider */

use frontend\models\Contact;
use frontend\models\Deal;
use frontend\models\DealStatus;
use frontend\widgets\Notification;
use yii\data\ActiveDataProvider;
use yii\web\View;
use function morphos\Russian\pluralize;

/** @var $this View */
/** @var $statuses DealStatus[] */
/** @var $model Contact */

$this->title = 'Сделки';

?>
<section class="funnel-section">
    <div class="funnel-section__header">
        <h1 class="funnel-section__headline">Сделки</h1>
        <div class="funnel-section__search">
            <div class="search-block">
                <form class="search-block__form" action="#" method="post">
                    <div class="search-block__field-wrapper"><label class="search-block__label" for="trade-search-field"><span class="visually-hidden">Поле поиска</span><svg width="16" height="16">
                                <use xlink:href="img/sprite.svg#zoom"></use>
                            </svg></label><input class="search-block__field" id="trade-search-field" type="search" placeholder="Поиск"><button class="visually-hidden" type="submit">Найти</button></div>
                </form>
            </div>
        </div><a class="button button--tiny funnel-section__btn modal-open" href="#">Создать</a>
    </div>
    <div class="funnel-table">
        <?php foreach ($statuses as $dealStatus): ?>
        <?php $deals = $dealStatus->deals; ?>
        <div class="funnel-table__col">
            <div class="funnel-table__header">
                <h2 class="funnel-table__title"><?=$dealStatus->name; ?></h2>
                <div class="funnel-table__col-summary">
                    <p class="funnel-table__tasks-number">
                        <?=pluralize(count($deals), 'сделка'); ?>
                    </p>
                    <p class="funnel-table__total">
                        <?=Yii::$app->formatter->asCurrency($dealStatus->dealsAmount, 'RUB');?>
                    </p>
                </div>
            </div>
            <ul class="funnel-table__list">
                <?php foreach ($deals as $deal): ?>
                <li class="funnel-table__item"><a class="trade-card" href="#">
                        <div class="trade-card__inner">
                            <h3 class="trade-card__headline"><?=$deal->name; ?></h3>
                            <p class="trade-card__agent"><?=$deal->company->name; ?></p>
                        </div>
                        <div class="trade-card__footer">
                            <p class="trade-card__tasks"></p>
                            <p class="trade-card__cost"><?=Yii::$app->formatter->asCurrency($deal->budget_amount, 'RUB');?></p>
                        </div>
                    </a></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php endforeach; ?>
    </div>
    <?= $this->render('//modals/_deal_form', ['model' => new Deal]); ?>
    <?= Notification::widget([
        'flashName' => 'deals_create',
        'title' => 'Новая сделка успешно добавлена.'
    ]); ?>
</section>
