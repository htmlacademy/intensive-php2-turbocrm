<?php
/* @var $content string */

use frontend\assets\MainAsset;
use yii\helpers\Html;
MainAsset::register($this);

?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title><?= Html::encode($this->title) ?></title>

    <?php $this->registerCsrfMetaTags() ?>
    <?php $this->head() ?>
</head>

<body>
<?php $this->beginBody() ?>

<header class="page-header">
    <div class="page-header__wrapper"><a class="page-header__logo logo" href="#" aria-label="Логотип TurboCRM"><svg width="44" height="45">
                <use xlink:href="img/sprite.svg#spiral"></use>
            </svg></a>
        <nav class="page-header__nav main-nav">
            <ul>
                <li class="active"><a href="">Контакты</a></li>
                <li><a href="">Компании</a></li>
                <li><a href="">Сделки</a></li>
                <li><a href="">Задачи</a></li>
                <li><a href="">Коммуникации</a></li>
                <li><a href="">Настройки</a></li>
            </ul>
        </nav>
        <div class="page-header__user-block user-block"><button class="user-block__toggler avatar" type="button"><span class="visually-hidden">Показать меню пользователя</span><span>A</span></button>
            <ul class="user-block__menu">
                <li><a href="#">Профиль</a></li>
                <li><a href="#">Выход</a></li>
            </ul>
        </div>
    </div>
</header>
<main class="crm-content">
    <?= $content ?>
</main>
<?php $this->endBody() ?>

</body>

</html>
<?php $this->endPage() ?>
