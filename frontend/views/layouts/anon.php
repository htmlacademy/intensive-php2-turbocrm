<?php
/* @var $content string */

use frontend\assets\AppAsset;
use yii\helpers\Html;
AppAsset::register($this);

?>
<?php $this->beginPage() ?>

<!DOCTYPE html>
<html lang="ru">
<head>
   <meta charset="utf-8"/>
   <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0"/>
   <title><?= Html::encode($this->title) ?></title>
   <link rel="stylesheet" href="/css/style.css" media="screen"/>
   <link rel="preload" href="/js/main.js" as="script"/>
   <link rel="preload" href="/fonts/ptsans.woff2" as="font" crossorigin="anonymous"/>
   <link rel="preload" href="/fonts/ptsansbold.woff2" as="font" crossorigin="anonymous"/>
    <?php $this->registerCsrfMetaTags() ?>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<header class="landing-header landing-header--registration"><a class="landing-header__link-logo" href="#"><img
   class="landing-header__link-img" src="/img/turbocrm-logo.svg" width="203" height="61" alt="Логотип TurboCRM"/></a><a
   class="button button--small landing-header__button modal-open" href="#"><span>Вход</span></a></header>
<main>
    <?= $content ?>
</main>
<footer class="footer"><a class="footer__link-logo" href="#"><img class="footer__link-img" src="/img/logo-mono.svg"
                                                                  width="152" height="45" alt="Логотип TurboCRM"></a>
   <nav class="footer__nav">
      <ul class="footer__list">
         <li class="footer__item"><a class="footer__link-nav" href="#">Контакты</a></li>
         <li class="footer__item"><a class="footer__link-nav" href="#">Компании</a></li>
         <li class="footer__item"><a class="footer__link-nav" href="#">Сделки</a></li>
         <li class="footer__item"><a class="footer__link-nav" href="#">Задачи</a></li>
         <li class="footer__item"><a class="footer__link-nav" href="#">Коммуникации</a></li>
      </ul>
   </nav>
   <a class="footer__copyright-link" href="#"><img class="footer__copyright-img" src="/img/html-academy-logo.png"
                                                   srcset="/img/html-academy-logo@2x.png 2x" width="139" height="48"
                                                   alt="Логотип HTML Academy"></a><span class="footer__copyright-text">© ООО «Интерактивные обучающие технологии», 2013−2019</span>
</footer>
<div class="modal">
   <div class="modal__container">
      <button class="button button--tiny button--gray modal__close" type="button"><span>&lt; Отмена</span></button>
      <form class="log-in" method="POST"><p class="log-in__title header-1">Вход для клиентов</p>
         <div class="field log-in__field"><input class="field__input input input--big" type="text"
                                                 placeholder="Электронная почта"></div>
         <div class="field log-in__field"><input class="field__input input input--big" type="password"
                                                 placeholder="Пароль"></div>
         <button class="button button--big log-in__button" type="submit"><span>Вход</span></button>
      </form>
   </div>
</div>
<script src="/js/main.js"></script>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
