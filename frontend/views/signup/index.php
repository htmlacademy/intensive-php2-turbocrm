<?php
use yii\helpers\Html;
use yii\widgets\ActiveForm; ?>

<div class="registration">
   <?php $form = ActiveForm::begin([
      'id' => 'signup-form',
       'options' => ['class' => 'registration__form']
]); ?>
   <p class="registration__title header-1">Регистрация</p>
<?php ActiveForm::end(); ?>
</div>
