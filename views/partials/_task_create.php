<?php

use app\models\Task;
use app\models\TaskType;
use app\models\User;
use yii\helpers\ArrayHelper;
use yii\widgets\ActiveForm;

/**
 * @var Task $model
 * @var integer $deal_id
 */
?>

<div class="task-widget">
    <a class="button button--shadow task-widget__button js-create-task" href="#"><span>Новая задача</span></a>
    <div class="alert task-widget__container js-task-widget">
        <button class="alert__close button button--icon task-widget__close-button" type="button">
            <svg width="24" height="24">
                <use xlink:href="/img/sprite.svg#x-circle"></use>
            </svg>
        </button>
        <div class="alert__content">
            <?php $form = ActiveForm::begin(['method' => 'post', 'action' => ['tasks/create'],
                'fieldConfig' => ['template' => '{input}']]); ?>
            <?=$form->field($model, 'description')
                ->textarea(['class' => 'textarea task-widget__textarea', 'rows' => 1, 'placeholder' => 'Описание']); ?>

            <div class="task-widget__form deal-form">
            <?=$form->field($model, 'deal_id')->hiddenInput(['value' => $deal_id]); ?>
            <?=$form->field($model, 'type_id', ['options' => ['class' => 'task-widget__type']])
                    ->dropDownList(ArrayHelper::map(TaskType::find()->all(), 'id', 'name'), ['class' => 'select', 'prompt' => 'Тип']); ?>

            <?=$form->field($model, 'executor_id', ['options' => ['class' => 'task-widget__executor']])
                ->dropDownList(ArrayHelper::map(User::find()->all(), 'id', 'name'), ['class' => 'select', 'prompt' => 'Исполнитель']); ?>

            <div class="task-widget__date-wrapper">
                <?=$form->field($model, 'due_date')
                    ->input('text', ['class' => 'task-widget__input task-widget__input--date deal-form__field--date deal-form__field js-resizable', 'placeholder' => 'Срок']); ?>
                <div class="task-widget__calendar-container"></div>
            </div>
            <button class="task-widget__button link" type="submit"><span>Добавить</span></button>
        </div>
        <?php ActiveForm::end(); ?>
        </div>
    </div>
</div>
