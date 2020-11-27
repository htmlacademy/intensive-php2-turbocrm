<?php
/* @var $content string */

use frontend\assets\MainAsset;
use yii\helpers\Html;
use yii\widgets\Menu;

MainAsset::register($this);
?>
<?php $this->beginPage(); ?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title><?= Html::encode($this->title); ?></title>

    <?php $this->registerCsrfMetaTags(); ?>
    <?php $this->head(); ?>
</head>

<body>
<?php $this->beginBody() ?>

<header class="page-header">
    <div class="page-header__wrapper">
        <a class="page-header__logo logo" href="/" aria-label="Логотип TurboCRM">
            <svg width="44" height="45"><use xlink:href="/img/sprite.svg#spiral"></use></svg>
        </a>
        <nav class="page-header__nav main-nav">
            <?=Menu::widget([
                'items' => [
                    ['label' => 'Контакты', 'url' => ['contacts/index']],
                    ['label' => 'Компании', 'url' => ['companies/index']],
                    ['label' => 'Задачи', 'url' => ['tasks/index']],
                    ['label' => 'Сделки', 'url' => ['deals/index']],
                    ['label' => 'Коммуникации', 'url' => ['inbox/email']],
                    ['label' => 'Настройки', 'url' => ['profile/settings']],
                ]
            ]); ?>
        </nav>
        <div class="page-header__user-block user-block">
            <button class="user-block__toggler avatar" type="button"><span>A</span></button>
            <ul class="user-block__menu">
                <li><?=Html::a('Настройки', ['profile/settings']); ?></li>
                <li><?=Html::a('Выход', ['user/logout']); ?></li>
            </ul>
        </div>
    </div>
</header>
<main class="<?=$this->params['main_class'] ?? 'crm-content'; ?>">
    <?= $content ?>
</main>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
