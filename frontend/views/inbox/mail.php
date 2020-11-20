<?php

use common\services\containers\MailMessage;
use yii\web\JqueryAsset;

$this->params['main_class'] = 'communication';

/**
 * @var $messages MailMessage[]
 * @var $selected_message MailMessage
 * @var $msgid string
 */

$this->registerJsFile('@web/js/inbox.js', ['depends' => [JqueryAsset::class]])

?>

<section class="communication-header communication__header">
    <h1 class="header-3 communication-header__caption">Коммуникации</h1>
    <button class="communication-header__button communication-header__mail active" data-target="mail">Почтовый ящик
    </button>
    <span class="communication-header__unread-count">2</span>
</section>
<section class="communication-mail communication__content show" id="mail">
    <div class="mail-list communication-mail__list">
        <div class="mail-list__actions">
            <div class="mail-list__search">
                <div class="search-block">
                    <form class="search-block__form" action="#" method="post">
                        <div class="search-block__field-wrapper"><label class="search-block__label"
                                                                        for="trade-search-field"><span
                                        class="visually-hidden">Поле поиска</span>
                                <svg width="16" height="16">
                                    <use xlink:href="/img/sprite.svg#zoom"></use>
                                </svg>
                            </label><input class="search-block__field" id="trade-search-field" type="search"
                                           placeholder="Поиск"/>
                            <button class="visually-hidden" type="submit">Найти</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <table class="mail-list__table" cellspacing="0">
            <thead>
            <tr>
                <th>
                    <p>Отправитель</p>
                </th>
                <th>
                    <p>Тема</p>
                </th>
                <th>
                    <p>Дата</p>
                </th>
            </tr>
            </thead>
            <tbody>
            <?php foreach($messages as $message): ?>
                <tr data-id="<?=$message->getId(); ?>"
                    class="<?=$message->getIsUnread() ? 'unread' : ''; ?> <?=$message->getId() == $msgid ? 'active' : ''; ?>">
                    <td><?=$message->getSender(); ?></td>
                    <td><?=$message->getSubject(); ?></td>
                    <td><?=Yii::$app->formatter->asDate($message->getDate(), 'short'); ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <div class="letter communication-mail__letter">
        <?php if ($selected_message): ?>
            <div class="letter__wrapper">
                <div class="letter__actions"><a class="button button--tiny button--gray letter__button" href="#"><span>Создать сделку</span></a><a
                            class="button button--tiny button--gray letter__button" href="#"><span>Создать задачу</span></a><a
                            class="button button--tiny button--gray letter__button"
                            href="#"><span>Добавить контакт</span></a>
                </div>
                <div class="letter__content">
                    <h2 class="letter__subject header-3"><?=$selected_message->getSubject(); ?></h2><span
                            class="letter__date"><?=Yii::$app->formatter->asDatetime($selected_message->getDate(), 'short'); ?></span>
                    <div class="letter__body">
<!--                        <p>Здравсвуйте Антон,</p>-->
<!--                        <p>Возникли вопросы по ТЭО, которое вы нам сформировали. Я сейчас по пунктам их и задам.-->
<!--                            Пожлуйста,-->
<!--                            помогите нам разобраться:</p>-->
<!--                        <p>- В части 1. На основе чего подсчитан остаток по рачету?<br>- Часть 2. Как проводился анализ-->
<!--                            рынка?<br>- Часть 4. Какие прогнозы по инвестиционному возврату?</p>-->
<!--                        <p>Спасибо,<br>Алексей Анатольев</p>-->
                    </div>
                </div>
            </div>
        <?php endif ?>
    </div>
</section>
<section class="communication-telegram communication__content" id="telegram">
    <div class="chat-list communication-telegram__list">
        <div class="chat-list__actions">
            <div class="chat-list__search">
                <div class="search-block">
                    <form class="search-block__form" action="#" method="post">
                        <div class="search-block__field-wrapper"><label class="search-block__label"
                                                                        for="trade-search-field"><span
                                        class="visually-hidden">Поле поиска</span>
                                <svg width="16" height="16">
                                    <use xlink:href="/img/sprite.svg#zoom"></use>
                                </svg>
                            </label><input class="search-block__field" id="trade-search-field" type="search"
                                           placeholder="Поиск"/>
                            <button class="visually-hidden" type="submit">Найти</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
