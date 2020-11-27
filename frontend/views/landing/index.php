<?php
use yii\helpers\Url;

$this->params['bodyClass'] = 'landing';
$this->params['headerClass'] = 'landing-header';
?>

<section class="intro">
    <h1 class="intro__title header-1">CRM-система для компаний любого профиля, работающих с клиентами через интернет.</h1>
    <a class="intro__link link link--big" href="<?=Url::to(['user/signup']); ?>">Попробовать ›</a>
</section>
<section class="features">
    <h2 class="visually-hidden">Преимущества</h2>
    <ul class="features__list">
        <li class="features__item">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0Z"
                      fill="url(#cloud_linear)"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M33 42C39.6274 42 45 36.6274 45 30C45 23.3726 39.6274 18 33 18C26.3726 18 21 23.3726 21 30C21 36.6274 26.3726 42 33 42Z"
                      fill="white"/>
                <rect x="11" y="30" width="28" height="12" rx="6" fill="white"/>
                <rect x="24" y="25" width="28" height="17" rx="7.5" fill="white"/>
                <defs>
                    <linearGradient id="cloud_linear" x1="64" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#960FFC"/>
                        <stop offset="1" stop-color="#0F85DB"/>
                    </linearGradient>
                </defs>
            </svg>
            <h3 class="features__title header-3">Облачное решение</h3>
            <p class="features__description">Наша CRM позволяет настроить двухстороннюю интеграцию с мессенджером
                telegram. Отвечайте и пишите вашим клиентам в telegram напрямую через наш сервис.</p>
        </li>
        <li class="features__item">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0Z"
                      fill="url(#message_linear)"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M32.5 44.5263C42.165 44.5263 50 38.3644 50 30.7632C50 23.162 42.165 17 32.5 17C22.835 17 15 23.162 15 30.7632C15 34.2966 16.6931 37.5191 19.476 39.9561C20.9911 41.2829 19.0575 47.8809 20.8715 47.8809C22.6855 47.8809 29.7738 44.5263 32.5 44.5263Z"
                      fill="white"/>
                <defs>
                    <linearGradient id="message_linear" x1="64" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#960FFC"/>
                        <stop offset="1" stop-color="#0F85DB"/>
                    </linearGradient>
                </defs>
            </svg>
            <h3 class="features__title header-3">Поддержка 24 / 7</h3>
            <p class="features__description">Профессиональные консультанты ответят на ваши вопросы в любое время суток
                удобным для вас способом, по телефону, почте или через чат.</p>
        </li>
        <li class="features__item">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0Z"
                      fill="url(#plane_linear)"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M41.6403 48.3826L47.6656 17.8503C47.6656 17.8503 47.746 17.4513 47.746 17.0522C47.746 16.4535 47.2104 16.254 46.7407 16.254C45.9767 16.2524 44.928 16.6259 44.9296 16.6275L10.6435 30.1456C10.6435 30.1456 9.14282 30.6213 9.14282 31.6191C9.14282 32.8163 10.6017 33.2346 10.6017 33.2346L18.5407 35.3301L40.368 22.513C40.7192 22.2472 41.2173 22.3108 41.4871 22.661C41.7537 23.0111 41.6882 23.5093 41.337 23.7751L25.641 38.2522L25.5384 38.8851L38.2335 49.3404C38.2335 49.3404 38.7112 49.7778 39.6377 49.7778C41.3813 49.7778 41.6403 48.3826 41.6403 48.3826Z"
                      fill="white"/>
                <defs>
                    <linearGradient id="plane_linear" x1="64" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#960FFC"/>
                        <stop offset="1" stop-color="#0F85DB"/>
                    </linearGradient>
                </defs>
            </svg>
            <h3 class="features__title header-3">Интеграция с Gmail</h3>
            <p class="features__description">Наша CRM позволяет настроить двухстороннюю интеграцию с вашим почтовым ящиком на Gmail.
                Вы сможете добавлять клиентов и сделки прямо из электронной почты.</p>
        </li>
    </ul>
</section>
<section class="communications">
    <h2 class="communications__title header-1">Все средства коммуникации в одном месте</h2>
    <p class="communications__description">Продвинутая интеграция с сервисами коммуникации. Есть поддержка электронной
        почты, СМС и Telegram. Общаться с клиентами и собирать заявки можно по любому из этих источников.</p>
</section>
<section class="work">
    <h2 class="work__title header-1">Запустите в работу ваши проекты уже сегодня</h2>
    <ul class="work__list">
        <li class="work__item">Ведение базы клиентов и компаний</li>
        <li class="work__item">Управление воронкой продаж</li>
        <li class="work__item">Постановка и отслеживание задач</li>
        <li class="work__item">Переписка с клиентами через встроенный интерфейс</li>
    </ul>
</section>
