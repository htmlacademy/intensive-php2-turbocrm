<?php
/** @var ActiveDataProvider $dataProvider */

use frontend\models\Company;
use frontend\models\Contact;
use frontend\models\Deal;
use frontend\models\User;
use frontend\widgets\FeedItem;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;
use yii\web\View;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

/** @var $this View */
/** @var $model Deal */

$this->title = 'Просмотр сделки';

$users     = User::find()->all();
$companies = Company::find()->all();
$contacts  = Contact::find()->all();
?>

<section class="deal-section">
    <h1 class="visually-hidden">Карточка сделки</h1>
    <div class="deal-section__card">
        <div class="deal-card js-tabs">
            <div class="deal-card__header">
                <div class="deal-card__title-line">
                    <h2 class="deal-card__title"><?=Html::encode($model->name); ?></h2>
                    <span class="deal-card__label label label--completed"><?=$model->status->name; ?></span>
                    <div class="deal-card__actions">
                        <div class="actions-list"><button class="actions-list__toggler button button--icon" type="button"><svg width="16" height="16">
                                    <use xlink:href="img/sprite.svg#settings"></use>
                                </svg></button>
                            <div class="actions-list__dropdown">
                                <ul>
                                    <li><button type="button">Вернуть в работу</button></li>
                                    <li><button type="button">Переименовать</button></li>
                                    <li><button type="button">Создать дубликат</button></li>
                                    <li><button type="button">Удалить</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="deal-card__tab-controls">
                    <ul class="tab-controls">
                        <li class="js-tab-control active"><button type="button">Основное</button></li>
                        <li class="js-tab-control"><button type="button">Задачи</button></li>
                        <li class="js-tab-control"><button type="button">Участники</button></li>
                    </ul>
                </div>
            </div>
            <div class="deal-card__content">
                <div class="deal-card__tabs">
                    <div class="deal-card__tab tab js-tab active">
                            <?php
                            $form = ActiveForm::begin([
                                'method' => 'post',
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
                                <?= $form->field($model, 'executor_id')->dropDownList(ArrayHelper::map($users, 'id', 'email'), [
                                    'class' => 'deal-form__select select', 'prompt' => 'Не указан'
                                ]); ?>
                                <?= $form->field($model, 'due_date', [
                                        'options' => ['class' => 'deal-form__row calendar'],
                                        'inputOptions' => ['class' => 'deal-form__field deal-form__field--date js-calendar']
                                ]); ?>
                                <?= $form->field($model, 'description', [
                                    'template' => "{label}\n<div class='deal-form__message-box message-box'>{input}\n{hint}</div>",
                                    'parts' => ['{hint}' => '<div class="message-box__actions"><button class="message-box__edit button button--icon js-message-edit" type="button"><svg width="12" height="13">
                                                    <use xlink:href="img/sprite.svg#edit"></use>
                                                </svg><span>Редактировать</span></button>
                                            <div class="message-box__buttons"><button class="message-box__cancel button button--plain js-message-cancel" type="button">Отмена</button><button class="message-box__save button button--plain js-message-save" type="button"><b>Сохранить</b></button></div>
                                        </div>'],
                                    'options' => ['class' => 'deal-form__row deal-form__row--message']
                                ])->textarea(['class' => 'message-box__field js-message-field', 'readonly' => true]); ?>

                                <?= $form->field($model, 'contact_id')->dropDownList(ArrayHelper::map($contacts, 'id', 'email'), [
                                    'class' => 'deal-form__select select', 'prompt' => 'Не указан'
                                ]); ?>
                                <?= $form->field($model, 'company_id')->dropDownList(ArrayHelper::map($companies, 'id', 'name'), [
                                    'class' => 'deal-form__select select', 'prompt' => 'Не указан'
                                ]); ?>
                            </div>
                            <div class="deal-form__section">
                                <h3 class="deal-form__section-title">Финансы</h3>
                                <?= $form->field($model, 'budget_amount', [
                                    'parts' => ['hint' => '<p class="deal-form__save"><b>Enter</b> чтобы сохранить</p>'],
                                    'inputOptions' => ['class' => 'deal-form__field js-resizable', 'data-postfix' => 'руб.']
                                ]); ?>
                            </div>
                        <?php ActiveForm::end(); ?>

                    </div>
                    <div class="deal-card__tab tab js-tab">
                        <div class="task"><a class="button button--shadow task__button" href="#"><span>Новая задача</span></a>
                            <table class="task__table" cellspacing="0">
                                <tr>
                                    <th>
                                        <p>Статус</p>
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
                                <tr>
                                    <td>
                                        <p>В работе</p>
                                    </td>
                                    <td>
                                        <p>Аналитика</p>
                                    </td>
                                    <td>
                                        <p>Анна Михайлова</p>
                                    </td>
                                    <td>
                                        <p>21-05-2019</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Новая</p>
                                    </td>
                                    <td>
                                        <p>Презентация</p>
                                    </td>
                                    <td>
                                        <p>Евгений Кочергин</p>
                                    </td>
                                    <td>
                                        <p>12-05-2019</p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="deal-card__tab tab js-tab">
                        <div class="members">
                            <div class="contact members__contact">
                                <div class="avatar avatar--contact contact__avatar"><span>O</span></div>
                                <div class="contact__inner"><a class="contact__name" href="#">Олег Иванов</a>
                                    <p class="contact__last-connection">Последний контакт 2 ч. назад</p>
                                    <p class="contact__row contact__row--company"><span class="contact__title">Компания:</span><a class="contact__value link" href="#">ПАО Газпром</a></p>
                                    <p class="contact__row contact__row--position"><span class="contact__title">Должность:</span><span class="contact__value">Менеджер</span></p>
                                </div>
                            </div>
                            <div class="contact members__contact">
                                <div class="avatar avatar--contact avatar--blue contact__avatar"><span>А</span></div>
                                <div class="contact__inner"><a class="contact__name" href="#">Арсений Петров</a>
                                    <p class="contact__last-connection">Последний контакт 1 д. назад</p>
                                    <p class="contact__row contact__row--company"><span class="contact__title">Компания:</span><a class="contact__value link" href="#">ПАО Газпром</a></p>
                                    <p class="contact__row contact__row--position"><span class="contact__title">Должность:</span><span class="contact__value">Финансовый аналитик</span></p>
                                </div>
                            </div>
                            <div class="contact members__contact">
                                <div class="avatar avatar--contact avatar--blue contact__avatar"><span>M</span></div>
                                <div class="contact__inner"><a class="contact__name" href="#">Максим Емельянов</a>
                                    <p class="contact__last-connection">Последний контакт 2 ч. назад</p>
                                    <p class="contact__row contact__row--company"><span class="contact__title">Компания:</span><a class="contact__value link" href="#">ПАО Газпром</a></p>
                                    <p class="contact__row contact__row--position"><span class="contact__title">Должность:</span><span class="contact__value">Аналитик</span></p>
                                </div>
                            </div>
                            <div class="contact members__contact">
                                <div class="avatar avatar--contact contact__avatar"><span>O</span></div>
                                <div class="contact__inner"><a class="contact__name" href="#">Анастасия Михайлова</a>
                                    <p class="contact__last-connection">Последний контакт 1 д. назад</p>
                                    <p class="contact__row contact__row--company"><span class="contact__title">Компания:</span><a class="contact__value link" href="#">Ситилинк</a></p>
                                    <p class="contact__row contact__row--position"><span class="contact__title">Должность:</span><span class="contact__value">Дизайнер</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="deal-section__log">
        <div class="deal-log">
            <div class="task-widget"><a class="button button--shadow task-widget__button js-create-task" href="#"><span>Новая задача</span></a>
                <div class="alert task-widget__container js-task-widget"><button class="alert__close button button--icon task-widget__close-button" type="button"><svg width="24" height="24">
                            <use xlink:href="img/sprite.svg#x-circle"></use>
                        </svg></button>
                    <div class="alert__content"><textarea class="textarea task-widget__textarea" rows="1" placeholder="Описание"></textarea>
                        <form class="task-widget__form deal-form" method="POST">
                            <div class="task-widget__type"><select class="select">
                                    <option value="0" placeholder="placeholder">Тип задачи</option>
                                    <option value="1">Разработка</option>
                                    <option value="2">Маркетинг</option>
                                    <option value="3">Дизайн</option>
                                    <option value="4">Аналитика</option>
                                    <option value="5">Копирайтинг</option>
                                </select></div>
                            <div class="task-widget__executor"><select class="select">
                                    <option value="0" placeholder="placeholder">Исполнитель</option>
                                    <option value="1">Олег Иванов</option>
                                    <option value="2">Анна Михайлова</option>
                                    <option value="3">Алиса Федосеева</option>
                                    <option value="4">Влад Климов</option>
                                    <option value="5">Михайл Кочетков</option>
                                    <option value="6">Юрий Пономарев</option>
                                    <option value="7">Яна Светлова</option>
                                </select></div>
                            <div class="task-widget__date-wrapper"><input class="task-widget__input task-widget__input--date deal-form__field--date deal-form__field js-resizable" type="text" readonly="readonly" placeholder="Срок" />
                                <div class="task-widget__calendar-container"></div>
                            </div><button class="task-widget__button link" type="submit"><span>Добавить</span></button>
                        </form>
                    </div>
                </div>
            </div>
            <p class="header-3 deal-log__header">События</p>
            <ul class="deal-log__list">
                <?php foreach ($model->getFeedItems() as $feedItem): ?>
                    <?= FeedItem::widget(['model' => $feedItem]); ?>
                <?php endforeach; ?>
            </ul>
        </div>
        <div class="message-panel deal-log__message-panel">
            <form class="message-panel__form" method="POST"><input class="message-panel__input input" type="text" name="message" placeholder="Сообщение" autocomplete="off" /><button class="message-panel__button button button--rounded-blue" type="submit"><span>Отправить</span></button>
                <div class="message-panel__options"><a class="message-panel__toggle message-panel__toggle--active" href="#">Заметка</a><a class="message-panel__toggle" href="#">СМС</a><span class="message-panel__length">0 / 500</span></div>
            </form>
        </div>
    </div>
</section>
