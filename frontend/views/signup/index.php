<?php
/* @var $model User */

use yii\widgets\ActiveForm;
use yii\widgets\ActiveField; ?>

<div class="registration">
   <?php $form = ActiveForm::begin(['id' => 'signup-form', 'enableAjaxValidation' => true,
       'options' => ['class' => 'registration__form']]); ?>
   <p class="registration__title header-1">Регистрация</p>

   <?php foreach ($model->attributeLabels() as $attr => $label): ?>
      <?php $field = new ActiveField([
            'model' => $model, 'template' => "{input}\n{error}", 'attribute' => $attr, 'form' => $form,
            'options' => ['class' => 'field registration__field']]);
            $field->textInput(['class' => 'field__input input input--big placeholder-shown', 'placeholder' => $label]); ?>
      <?=$field->render(); ?>
   <?php endforeach; ?>

   <button class="button button--big registration__button" type="submit"><span>Поехали!</span></button>
<?php ActiveForm::end(); ?>
</div>
