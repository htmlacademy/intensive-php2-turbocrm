<?php
use app\models\Company;
use app\models\Contact;
use app\models\DealStatus;
use app\models\User;
use yii\helpers\ArrayHelper;
use yii\widgets\ActiveForm;

$companies = Company::find()->all();
$contacts  = Contact::find()->all();
$statuses  = DealStatus::find()->all();
$users     = User::find()->all();
?>

<div class="modal">
    <div class="modal__container">
        <button class="button button--tiny button--gray modal__close" type="button"><span>&lt; Отмена</span></button>
        <?php
        $form = ActiveForm::begin([
            'method' => 'post', 'action' => ['deals/create'], 'id' => 'deal-create-form',
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
        <p class="create-deal__title header-3">Новая сделка</p>
        <p class="title create-deal__caption"><span>Основное</span></p>
        <div class="create-deal__basic-block">
            <?= $form->field($model, 'name'); ?>
            <?= $form->field($model, 'company_id', [
                'options' => ['class' => 'field create-contact__field field--select']
            ])->dropDownList(ArrayHelper::map($companies, 'id', 'name'), [
                'class' => 'field__select select', 'prompt' => 'Выбрать'
            ]); ?>
            <?= $form->field($model, 'contact_id', [
                'options' => ['class' => 'field create-contact__field field--select']
            ])->dropDownList(ArrayHelper::map($contacts, 'id', 'name'), [
                'class' => 'field__select select', 'prompt' => 'Выбрать'
            ]); ?>
            <?= $form->field($model, 'due_date', [
                'inputOptions' => ['class' => 'field__input input js-calendar']
            ]); ?>
        </div>
        <p class="title create-deal__caption"><span>Описание</span></p>
        <?= $form->field($model, 'description', [
            'options' => ['class' => 'field create-deal__field create-deal__field--description']
        ])->textarea(['class' => 'field__textarea textarea']); ?>
        <p class="title create-deal__caption"><span>Финансы</span></p>
        <div class="create-deal__finance-block">
            <?= $form->field($model, 'budget_amount', [
                'options' => ['class' => 'field create-deal__field create-deal__field--small'],
                'inputOptions' => ['type' => 'number']
            ]); ?>
        </div>
        <p class="title create-deal__caption"><span>Исполнение</span></p>
        <div class="create-deal__execution-block">
            <?= $form->field($model, 'executor_id', [
                'options' => ['class' => 'field create-contact__field field--select']
            ])->dropDownList(ArrayHelper::map($users, 'id', 'email'), [
                'class' => 'field__select select', 'prompt' => 'Выбрать'
            ]); ?>
            <?= $form->field($model, 'status_id', [
                'options' => ['class' => 'field field--select create-deal__field create-deal__field--small']
            ])->dropDownList(ArrayHelper::map($statuses, 'id', 'name'), [
                'class' => 'field__select select', 'prompt' => 'Выбрать'
            ]); ?>
        </div>
        <button class="button button--normal" type="submit"><span>Добавить</span></button>
        <?php ActiveForm::end(); ?>
    </div>
</div>

