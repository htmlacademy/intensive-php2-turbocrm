<?php
use app\models\Company;
use app\models\Contact;
use app\models\ContactType;
use yii\helpers\ArrayHelper;
use yii\widgets\ActiveForm;
/** @var $model Contact */

$companies = Company::find()->asArray()->all();
$types_list = ContactType::find()->asArray()->all();

$action = $model->id ? 'update' : 'create';
$title = $model->id ? 'Редактирование контакта' : 'Новый контакт';

?>

<div class="modal">
    <div class="modal__container">
        <button class="button button--tiny button--gray modal__close" type="button"><span>&lt; Отмена</span></button>
        <?php
        $form = ActiveForm::begin([
            'method' => 'post', 'action' => ['contacts/' . $action, 'id' => $model->id], 'id' => 'contact-create-form',
            'enableAjaxValidation' => true,
            'options' => ['class' => 'create-contact'],
            'errorCssClass' => 'field--error',
            'fieldConfig' => [
                'options' => ['class' => 'field create-contact__field'],
                'inputOptions' => ['class' => 'field__input input'],
                'labelOptions' => ['class' => 'field__label'],
                'errorOptions' => ['class' => 'field__error-message']
            ]
        ]); ?>
        <p class="create-contact__title header-3"><?=$title;?></p>

        <?=$form->field($model, 'name'); ?>

        <?=$form->field($model, 'company_id', [
            'options' => ['class' => 'field create-contact__field field--select']
        ])->dropDownList(ArrayHelper::map($companies, 'id', 'name'), [
            'class' => 'field__select select', 'prompt' => 'Выбрать'
        ]); ?>

        <?=$form->field($model, 'position'); ?>

        <?=$form->field($model, 'type_id', [
            'options' => ['class' => 'field field--select create-contact__field create-contact__field--small']
        ])->dropDownList(ArrayHelper::map($types_list, 'id', 'name'), [
            'class' => 'field__select select', 'prompt' => 'Выбрать'
        ]); ?>

        <?=$form->field($model, 'phone'); ?>
        <?=$form->field($model, 'email'); ?>

        <div class="create-contact__bottom-block create-contact__bottom-block--error">
            <button class="button button--normal create-contact__button" type="submit">
                <span>Добавить</span>
            </button>
            <span class="create-contact__description">Обязательные поля</span>
        </div>
        <?php ActiveForm::end(); ?>
    </div>
</div>
