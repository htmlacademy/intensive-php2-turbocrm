<?php
/* @var $model ProfileSettingsForm */

use frontend\models\ProfileSettingsForm;
use frontend\models\User;
use yii\widgets\ActiveForm;

$this->params['main_class'] = 'settings';
?>

<h1 class="header-3 settings__header">Настройки</h1>
<div class="settings__content settings__content--account show" id="account">
    <?php $form = ActiveForm::begin(
            [
                'id' => 'settings-form',
                'enableAjaxValidation' => false,
                'options' => ['class' => 'settings__form'],
                'fieldConfig' => [
                    'options' => ['class' => 'field field--big settings__field'],
                    'labelOptions' => ['class' => 'field__label'],
                    'inputOptions' => ['class' => 'field__input input'],
                ]
            ]
    ); ?>
    <?=$form->field($model, 'name'); ?>
    <?=$form->field($model, 'company'); ?>
    <?=$form->field($model, 'position'); ?>
    <?=$form->field($model, 'phone'); ?>

    <p class="title settings__caption settings__caption--account"><span>Смена пароля</span></p>

    <?=$form->field($model, 'new_password')->passwordInput(); ?>
    <?=$form->field($model, 'new_password_repeat')->passwordInput(); ?>

    <button class="button button--normal settings__button-account" type="submit">Сохранить</button>
    <?php ActiveForm::end(); ?>
</div>

