<?php
/* @var $model User */

use yii\widgets\ActiveForm;
use yii\widgets\ActiveField; ?>

<div class="login-contaner">
   <div class="modal__container">
       <?php
       $form = ActiveForm::begin(['id' => 'login-form', 'errorCssClass' => 'field--error', 'options' => ['class' => 'log-in']]); ?>
         <p class="log-in__title header-1">Вход для клиентов</p>
       <?=$form->field($model, 'email', ['template' => "{input}\n{error}", 'errorOptions' => ['class' => 'field__error-message'],
           'options' => ['class' => 'field log-in__field']])
       ->textInput(['class' => 'field__input input input--big', 'placeholder' => 'Электронная почта']); ?>

       <?=$form->field($model, 'password', ['template' => "{input}\n{error}", 'errorOptions' => ['class' => 'field__error-message'],
           'options' => ['class' => 'field log-in__field']])
           ->passwordInput(['class' => 'field__input input input--big', 'placeholder' => 'Пароль']); ?>

         <button class="button button--big log-in__button" type="submit"><span>Вход</span></button>
       <?php ActiveForm::end(); ?>
   </div>

</div>
