<?php
/* @var $model User */
/* @var $this View */

use frontend\models\User;
use yii\web\View;
use yii\widgets\ActiveForm;

$this->registerCssFile('css/sample.css');
$this->title = 'Регистрация нового пользователя';

?>

<div class="registration">
    <?php $form = ActiveForm::begin([
        'id' => 'signup-form',
        'enableAjaxValidation' => false,
        'options' => ['class' => 'registration__form'],
        'errorCssClass' => 'field--error',
        'fieldConfig' => [
            'template' => "{input}\n{error}",
            'options' => ['class' => 'field registration__field'],
            'inputOptions' => ['class' => 'field__input input input--big placeholder-shown'],
            'errorOptions' => ['tag' => 'span', 'class' => 'field__error-message']
        ]
    ]); ?>
    <p class="registration__title header-1">Регистрация</p>

    <?=$form->field($model, 'email')->textInput(['placeholder' => 'Email']); ?>
    <?=$form->field($model, 'name')->textInput(['placeholder' => 'Ваше имя']); ?>
    <?=$form->field($model, 'phone')->textInput(['placeholder' => 'Номер телефона']); ?>
    <?=$form->field($model, 'company')->textInput(['placeholder' => 'Название компании']); ?>
    <?=$form->field($model, 'password')->passwordInput(['placeholder' => 'Пароль']); ?>
    <?=$form->field($model, 'password_repeat')->passwordInput(['placeholder' => 'Повтор пароля']); ?>

    <button class="button button--big registration__button" type="submit"><span>Поехали!</span></button>
    <?php ActiveForm::end(); ?>
</div>
