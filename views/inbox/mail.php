<?php

use app\services\containers\MailMessage;
use app\models\EmailSearchForm;
use yii\helpers\Url;
use yii\web\JqueryAsset;
use yii\widgets\ActiveForm;

$this->params['main_class'] = 'communication';
$this->title = 'Сообщения электронной почты';

/**
 * @var $messages MailMessage[]
 * @var $selected_message MailMessage
 * @var $msgid string
 * @var $unread_count integer
 * @var $model EmailSearchForm
 */

$this->registerJsFile('@web/js/inbox.js', ['depends' => [JqueryAsset::class]])
?>

<section class="communication-header communication__header">
    <h1 class="header-3 communication-header__caption">Коммуникации</h1>
    <button class="communication-header__button communication-header__mail active" data-target="mail">Почтовый ящик
    </button>
    <?php if ($unread_count): ?>
        <span class="communication-header__unread-count"><?=$unread_count; ?></span>
    <?php endif ?>
</section>
<section class="communication-mail communication__content show" id="mail">
    <div class="mail-list communication-mail__list">
        <div class="mail-list__actions">
            <div class="mail-list__search">
                <div class="search-block">
                    <?php $form = ActiveForm::begin(['method' => 'get', 'options' => ['class' => 'search-block__form']]);?>
                    <?=$form->field($model, 'q', ['labelOptions' => ['class' => 'search-block__label'], 'options' => ['class' => 'search-block__field-wrapper']])
                                ->input('search', ['class' => 'search-block__field', 'placeholder' => 'Поиск'])
                                ->label(''); ?>
                            <button class="visually-hidden" type="submit">Найти</button>
                    <?php ActiveForm::end(); ?>
                </div>
            </div>
        </div>
        <table class="mail-list__table" cellspacing="0">
            <thead>
            <tr>
                <th><p>Отправитель</p></th>
                <th><p>Тема</p></th>
                <th><p>Дата</p></th>
            </tr>
            </thead>
            <tbody>
            <?php foreach($messages as $message): ?>
                <tr data-id="<?=$message->getId(); ?>"
                    class="<?=$message->getIsUnread() ? 'unread' : ''; ?> <?=$message->getId() == $msgid ? 'active' : ''; ?>">
                    <td><?=$message->getSenderName(); ?></td>
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
                <div class="letter__actions">
                    <a class="button button--tiny button--gray letter__button" href="<?=Url::toRoute(['inbox/create-contact', 'msgid' => $selected_message->getId()]); ?>">
                        <span>Добавить контакт</span>
                    </a>
                    <a class="button button--tiny button--gray letter__button" href="<?=Url::toRoute(['inbox/create-deal', 'msgid' => $selected_message->getId()]); ?>">
                        <span>Создать сделку</span>
                    </a>
                </div>
                <div class="letter__content">
                    <h2 class="letter__subject header-3"><?=$selected_message->getSubject(); ?></h2><span
                            class="letter__date"><?=Yii::$app->formatter->asDatetime($selected_message->getDate(), 'short'); ?></span>
                    <div class="letter__body">
                        <?=$selected_message->getBody(); ?>
                    </div>
                </div>
            </div>
        <?php endif ?>
    </div>
</section>
