<?php

use app\models\Company;
use app\models\Contact;
use app\models\ContactType;
use yii\helpers\ArrayHelper;
use yii\widgets\ActiveForm;

/** @var $model Contact */

$types_list = ContactType::find()->asArray()->all();
$companies = Company::find()->asArray()->all();
?>

<div class="contacts-section__filters js-filters">
    <div class="filters-block">
        <?php $form = ActiveForm::begin([
            'method' => 'get',
            'options' => ['class' => 'filters-block__form']
        ]); ?>
        <?=$form->field($model, 'type_id', [
            'template' => "{label}\n{input}",
            'options' => ['class' => 'filters-block__field field field--select field--small']
        ])->dropDownList(ArrayHelper::map($types_list, 'id', 'name'), [
            'class' => 'field__select select', 'prompt' => 'Статус'])
            ->label('Статус', ['class' => 'field__label']); ?>

        <?=$form->field($model, 'company_id', [
            'template' => "{label}\n{input}",
            'options' => ['class' => 'filters-block__field field field--select field--small']
        ])->dropDownList(ArrayHelper::map($companies, 'id', 'name'), [
            'class' => 'field__select select', 'prompt' => 'Компания'])->label('Компания', ['class' => 'field__label']); ?>

        <?=$form->field($model, 'onlyDeals', ['options' => ['class' => 'filters-block__field field']])->checkbox(); ?>

        <button class="filters-block__btn button button--normal" type="submit">Применить</button>
        <?php ActiveForm::end(); ?>
        <button class="filters-block__close button button--icon js-filters-toggler" type="button">
            <svg width="24" height="24">
                <use xlink:href="/img/sprite.svg#x-circle"></use>
            </svg>
        </button>
    </div>
</div>
