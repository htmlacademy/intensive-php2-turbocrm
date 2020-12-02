<?php
use yii\helpers\Url;

/**
 * @var $alias string
 * @var $id string
 */
?>

<div class="data-table__edit-block">
    <div class="data-table__buttons">
        <a href="<?=Url::to(["$alias/delete", 'id' => $id]); ?>" class="data-table__btn button button--tiny button--red">Удалить</a>
        <a href="<?=Url::to(["$alias/index", 'id' => $id, 'modal' => 1]); ?>" class="data-table__btn button button--tiny button--gray">Редактировать</a>
        <button class="data-table__close-edition button button--icon js-toggle-edition"
                type="button">
            <svg width="24" height="24">
                <use xlink:href="/img/sprite.svg#x-circle"></use>
            </svg>
        </button>
    </div>
    <button class="data-table__edit js-toggle-edition" type="button">
        <svg width="16" height="17">
            <use xlink:href="/img/sprite.svg#edit"></use>
        </svg>
    </button>
</div>
