<?php
/* @var $model User */

use frontend\models\User;
use yii\widgets\ActiveForm;
?>

<div class="modal">
    <div class="modal__container">
        <button class="button button--tiny button--gray modal__close" type="button"><span>&lt; Отмена</span></button>
        <?php $form = ActiveForm::begin([
                'id' => 'login-form', 'enableAjaxValidation' => true, 'enableClientValidation' => true,
                'errorCssClass' => 'field--error', 'action' => 'user/login',
                'options' => ['class' => 'log-in']
        ]); ?>

        <p class="log-in__title header-1">Вход для клиентов</p>
        <?= $form->field($model, 'email', ['template' => "{input}\n{error}", 'errorOptions' => ['class' => 'field__error-message'],
            'options' => ['class' => 'field log-in__field']])
            ->textInput(['class' => 'field__input input input--big', 'placeholder' => 'Электронная почта']); ?>

        <?= $form->field($model, 'password', ['template' => "{input}\n{error}", 'errorOptions' => ['class' => 'field__error-message'],
            'options' => ['class' => 'field log-in__field']])
            ->passwordInput(['class' => 'field__input input input--big', 'placeholder' => 'Пароль']); ?>

        <button class="button button--big log-in__button" type="submit"><span>Вход</span></button>
        <?php ActiveForm::end(); ?>
        <span>Тестовый вход: demo@demo.ru / demo</span>
    </div>
</div>
