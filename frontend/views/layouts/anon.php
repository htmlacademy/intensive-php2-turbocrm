<?php
/* @var $content string */
/* @var $this View */

use frontend\assets\MainAsset;
use frontend\models\LoginForm;
use yii\helpers\Html;
use yii\web\View;

MainAsset::register($this);
$this->registerLinkTag(['rel' => 'icon', 'type' => 'iamge/png', 'href' => '/favicon.png']); ?>
<?php $this->beginPage() ?>

<!DOCTYPE html>
<html lang="ru">
<head>
   <meta charset="utf-8"/>
   <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0"/>
   <title><?= Html::encode($this->title); ?> | TurboCRM</title>
    <?php $this->registerCsrfMetaTags() ?>
    <?php $this->head() ?>
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
<body class="<?=$this->params['bodyClass'] ?? ''; ?>">
<?php $this->beginBody() ?>

<header class="<?=$this->params['headerClass'] ?? 'landing-header landing-header--registration'; ?>">
    <a class="landing-header__link-logo" href="/"><img
   class="landing-header__link-img" src="/img/turbocrm-logo.svg" width="203" height="61" alt="Логотип TurboCRM"/></a><a
   class="button button--small landing-header__button modal-open" href="#"><span>Вход</span></a></header>
<main>
    <?= $content ?>
</main>
<footer class="footer"><a class="footer__link-logo" href="#"><img class="footer__link-img" src="/img/logo-mono.svg" width="152" height="45" alt="Логотип TurboCRM"></a>
   <nav class="footer__nav">

   </nav>
   <a class="footer__copyright-link" href="https://htmlacademy.ru">
       <img class="footer__copyright-img" src="/img/html-academy-logo.png"
            srcset="/img/html-academy-logo@2x.png 2x" width="139" height="48" alt="Логотип HTML Academy"></a>
    <span class="footer__copyright-text">© ООО «Интерактивные обучающие технологии», 2013−2021</span>
</footer>
<?= $this->render('//modals/_login_form', ['model' => new LoginForm]); ?>
<?php $this->endBody(); ?>
</body>
</html>
<?php $this->endPage(); ?>
