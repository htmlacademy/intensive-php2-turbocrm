<?php
/* @var $content string */

use frontend\assets\MainAsset;
use yii\helpers\Html;
use yii\widgets\Menu;

MainAsset::register($this);
$this->registerLinkTag(['rel' => 'icon', 'type' => 'iamge/png', 'href' => '/favicon.png']); ?>
<?php $this->beginPage(); ?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title><?= Html::encode($this->title); ?> | TurboCRM</title>

    <?php $this->registerCsrfMetaTags(); ?>
    <?php $this->head(); ?>
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(70009378, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/70009378" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
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
