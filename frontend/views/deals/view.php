<?php
/** @var ActiveDataProvider $dataProvider */

use frontend\models\Company;
use frontend\models\Contact;
use frontend\models\Deal;
use frontend\models\Note;
use frontend\models\Task;
use frontend\models\User;
use frontend\widgets\FeedItem;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;
use yii\web\JqueryAsset;
use yii\web\View;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

/** @var $this View */
/** @var $deal Deal */
/** @var $note Note */

$this->title = 'Просмотр сделки';

$users = User::find()->all();
$companies = Company::find()->all();
$contacts = Contact::find()->all();

$this->registerJsFile('@web/js/deal-form.js', ['depends' => [JqueryAsset::class]]);

$prevStatus = $deal->status->getPrevStatus();
$nextStatus = $deal->status->getNextStatus();
?>

<section class="deal-section">
    <h1 class="visually-hidden">Карточка сделки</h1>
    <div class="deal-section__card">
        <div class="deal-card js-tabs">
            <div class="deal-card__header">
                <div class="deal-card__title-line">
                    <h2 class="deal-card__title"><?= Html::encode($deal->name); ?></h2>
                    <span class="deal-card__label label label--completed"><?= $deal->status->name; ?></span>
                    <div class="deal-card__actions">
                        <div class="actions-list">
                            <button class="actions-list__toggler button button--icon" type="button">
                                <svg width="16" height="16">
                                    <use xlink:href="/img/sprite.svg#settings"></use>
                                </svg>
                            </button>
                            <div class="actions-list__dropdown">
                                <ul>
                                    <?php if ($prevStatus): ?>
                                    <li><?=Html::a("← «{$prevStatus->name}»", ['deals/prev', 'id' => $deal->id]); ?></li>
                                    <?php endif; ?>

                                    <?php if ($nextStatus): ?>
                                        <li><?= Html::a("→ «{$nextStatus->name}»", ['deals/next', 'id' => $deal->id]); ?></li>
                                    <?php endif ?>

                                    <li><?=Html::a('Удалить', ['deals/delete', 'id' => $deal->id]); ?></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="deal-card__tab-controls">
                    <ul class="tab-controls">
                        <li class="js-tab-control active">
                            <button type="button">Основное</button>
                        </li>
                        <li class="js-tab-control">
                            <button type="button">Задачи</button>
                        </li>
                        <li class="js-tab-control">
                            <button type="button">Участники</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="deal-card__content">
                <div class="deal-card__tabs">
                    <div class="deal-card__tab tab js-tab active">
                        <?php
                        $form = ActiveForm::begin([
                            'method' => 'post', 'action' => ['deals/save', 'id' => $deal->id],
                            'id' => 'deal-form',
                            'options' => ['class' => 'deal-form'],
                            'fieldConfig' => [
                                'options' => ['class' => 'deal-form__row'],
                                'inputOptions' => ['class' => 'field__input input'],
                                'labelOptions' => ['class' => 'deal-form__label'],
                                'errorOptions' => ['class' => 'field__error-message']
                            ]
                        ]); ?>
                        <div class="deal-form__section">
                            <h3 class="visually-hidden">Основная информация</h3>
                            <?= $form->field($deal, 'executor_id')->dropDownList(ArrayHelper::map($users, 'id', 'name'), [
                                'class' => 'deal-form__select select', 'prompt' => 'Не указан'
                            ]); ?>
                            <?= $form->field($deal, 'due_date', [
                                'options' => ['class' => 'deal-form__row calendar'],
                                'inputOptions' => ['class' => 'deal-form__field deal-form__field--date js-calendar']
                            ]); ?>
                            <?= $form->field($deal, 'description', [
                                'template' => "{label}\n<div class='deal-form__message-box message-box'>{input}\n{hint}</div>",
                                'parts' => ['{hint}' => '<div class="message-box__actions"><button class="message-box__edit button button--icon js-message-edit" type="button"><svg width="12" height="13">
                                                    <use xlink:href="/img/sprite.svg#edit"></use>
                                                </svg><span>Редактировать</span></button>
                                            <div class="message-box__buttons"><button class="message-box__cancel button button--plain js-message-cancel" type="button">Отмена</button><button class="message-box__save button button--plain js-message-save" type="button"><b>Сохранить</b></button></div>
                                        </div>'],
                                'options' => ['class' => 'deal-form__row deal-form__row--message']
                            ])->textarea(['class' => 'message-box__field js-message-field', 'readonly' => true]); ?>

                            <?= $form->field($deal, 'contact_id')->dropDownList(ArrayHelper::map($contacts, 'id', 'name'), [
                                'class' => 'deal-form__select select', 'prompt' => 'Не указан'
                            ]); ?>
                            <?= $form->field($deal, 'company_id')->dropDownList(ArrayHelper::map($companies, 'id', 'name'), [
                                'class' => 'deal-form__select select', 'prompt' => 'Не указан'
                            ]); ?>
                        </div>
                        <div class="deal-form__section">
                            <h3 class="deal-form__section-title">Финансы</h3>
                            <?= $form->field($deal, 'budget_amount', [
                                'parts' => ['hint' => '<p class="deal-form__save"><b>Enter</b> чтобы сохранить</p>'],
                                'inputOptions' => ['class' => 'deal-form__field js-resizable', 'data-postfix' => 'руб.']
                            ]); ?>
                        </div>
                        <?php ActiveForm::end(); ?>
                    </div>
                    <div class="deal-card__tab tab js-tab">
                        <div class="task"><a class="button button--shadow js-create-task task__button" href="#"><span>Новая задача</span></a>
                            <?php if ($deal->tasks): ?>
                            <table class="task__table" cellspacing="0">
                                <tr>
                                    <th>
                                        <p>Дата создания</p>
                                    </th>
                                    <th>
                                        <p>Тип</p>
                                    </th>
                                    <th>
                                        <p>Исполнитель</p>
                                    </th>
                                    <th>
                                        <p>Срок</p>
                                    </th>
                                </tr>
                                <?php foreach ($deal->tasks as $task): ?>
                                <tr>
                                    <td><p><?=$task->dt_add;?></p></td>
                                    <td><p><?=$task->type->name; ?></p></td>
                                    <td><p><?=$task->executor->name; ?></p></td>
                                    <td><p><?=$task->due_date; ?></p></td>
                                </tr>
                                <?php endforeach; ?>
                            </table>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="deal-card__tab tab js-tab">
                        <div class="members">
                            <?php foreach ($deal->getAllParticipants() as $person): ?>
                                <div class="contact members__contact">
                                    <div class="avatar avatar--contact contact__avatar"><span>O</span></div>
                                    <div class="contact__inner"><a class="contact__name" href="#"><?=$person->getPersonName(); ?></a>
                                        <p class="contact__row contact__row--company"><span
                                                    class="contact__title">Компания:</span><a class="contact__value link"
                                                                                              href="#"><?=$person->getPersonCompany(); ?></a></p>
                                        <p class="contact__row contact__row--position"><span
                                                    class="contact__title">Должность:</span>
                                            <span class="contact__value"><?=$person->getPersonPosition(); ?></span>
                                        </p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="deal-section__log">
        <div class="deal-log">
            <?=$this->render('//partials/_task_create', ['model' => new Task, 'deal_id' => $deal->id]); ?>

            <p class="header-3 deal-log__header">События</p>
            <ul class="deal-log__list">
                <?php foreach ($deal->getFeedItems() as $feedItem): ?>
                    <?= FeedItem::widget(['model' => $feedItem]); ?>
                <?php endforeach; ?>
            </ul>
        </div>
        <div class="message-panel deal-log__message-panel">
            <?php $form = ActiveForm::begin([
                'method' => 'post',
                'options' => ['class' => 'message-panel__form'],
            ]); ?>
            <?= $form->field($note, 'content', ['template' => '{input}'])
                ->textInput(['class' => 'message-panel__input input', 'placeholder' => 'Сообщение']); ?>
            <button class="message-panel__button button button--rounded-blue" type="submit"><span>Отправить</span>
            </button>
            <?php ActiveForm::end(); ?>
        </div>
    </div>
</section>
