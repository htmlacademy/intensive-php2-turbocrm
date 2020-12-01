<?php

use frontend\helpers\DashboardPresentation;
use yii\helpers\Url;

$this->params['main_class'] = 'crm-content';
$this->title = 'Дашборд проекта';

/**
 * @var DashboardPresentation $presentationHelper
 */
?>
<section class="dasboard-section">
    <div class="dasboard-section__header">
        <h1 class="dasboard-section__title"><?=Yii::$app->user->getIdentity()->company; ?></h1>
        <time class="dasboard-section__date"><?=Yii::$app->formatter->asDatetime('now');?></time>
    </div>
    <div class="dasboard-section__body">
        <div class="dasboard-section__wrapper">
            <div class="dasboard-section__col">
                <div class="dashboard-card dasboard-section__card">
                    <div class="dashboard-card__header">
                        <h2 class="dashboard-card__title">Горящие задачи</h2>
                        <p class="dashboard-card__descr">Задачи сроки выполнения которых наступили или скоро наступят</p>
                    </div>
                    <div class="dashboard-card__body">
                        <div class="dashboard-card__table">
                            <table class="info-table">
                                <tr>
                                    <th>Сделка</th>
                                    <th>Тип</th>
                                    <th>Исполнитель</th>
                                    <th>Срок</th>
                                </tr>
                                <?php foreach ($presentationHelper->getHotTasks() as $task): ?>
                                <tr>
                                    <td><a href="<?=Url::to(['deals/view', 'id' => $task->deal_id]); ?>"><?=$task->deal->name; ?></a></td>
                                    <td><p><?=$task->type->name; ?></p></td>
                                    <td><p><?=$task->executor->name; ?></p></td>
                                    <td><p><?=Yii::$app->formatter->asDate($task->due_date, 'short'); ?></p></td>
                                </tr>
                                <?php endforeach; ?>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="dashboard-card dasboard-section__card">
                    <div class="dashboard-card__header">
                        <h2 class="dashboard-card__title">Новые компании</h2>
                        <p class="dashboard-card__descr">Недавно добавленные компании</p>
                    </div>
                    <div class="dashboard-card__body">
                        <div class="dashboard-card__list">
                            <ul>
                                <?php foreach ($presentationHelper->getNewestCompanies() as $company): ?>
                                <li>
                                    <h3><a href="<?=$company->url; ?>"><?=$company->name; ?></a></h3>
                                    <p><?=$company->address; ?></p>
                                </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="dashboard-card dasboard-section__card">
                    <div class="dashboard-card__header">
                        <h2 class="dashboard-card__title">Финансы</h2>
                        <p class="dashboard-card__descr">Данные по финансам в компании</p>
                    </div>
                    <div class="dashboard-card__body">
                        <div class="dashboard-card__info">
                            <?php [$forecast, $total] = $presentationHelper->getFinanceOverview() ?>
                            <ul>
                                <li>
                                    <h3><?=Yii::$app->formatter->asCurrency($forecast, 'RUB');?></h3>
                                    <p>потенциал</p>
                                </li>
                                <li>
                                    <h3><?=Yii::$app->formatter->asCurrency($total, 'RUB');?></h3>
                                    <p>заработано</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dasboard-section__col">
                <div class="dashboard-card dasboard-section__card">
                    <div class="dashboard-card__header">
                        <h2 class="dashboard-card__title">Счетчик сделок</h2>
                        <p class="dashboard-card__descr">Количество сделок в разных состояниях</p>
                    </div>
                    <div class="dashboard-card__body">
                        <div class="dashboard-card__info dashboard-card__info--small">
                            <ul>
                                <?php foreach ($presentationHelper->getDealsCounters() as $status => $count): ?>
                                <li>
                                    <h3><?=$count;?></h3>
                                    <p><?=$status; ?></p>
                                </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="dashboard-card dasboard-section__card">
                    <div class="dashboard-card__header">
                        <h2 class="dashboard-card__title">Общая статистика</h2>
                        <p class="dashboard-card__descr">Данные о текущем состоянии воронки продаж</p>
                    </div>
                    <div class="dashboard-card__body">
                        <div class="dashboard-card__stats">
                            <?php $cnt = $presentationHelper->getCommonCounters(); ?>
                            <ul>
                                <li><span>Выполненные сделки</span><b><?=$cnt['complete_deals'] ;?></b></li>
                                <li><span>Контакты</span><b><?=$cnt['contacts'] ;?></b></li>
                                <li><span>Компании</span><b><?=$cnt['companies'] ;?></b></li>
                                <li><span>Задачи</span><b><?=$cnt['tasks'] ;?></b></li>
                                <li><span>Сотрудники</span><b><?=$cnt['users'] ;?></b></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="dashboard-card dasboard-section__card">
                    <div class="dashboard-card__header">
                        <h2 class="dashboard-card__title">Производительность на этой неделе</h2>
                        <p class="dashboard-card__descr">Количество передвижения задач и сделок из состояния в состояние</p>
                    </div>
                    <div class="dashboard-card__body">
                        <div class="dashboard-card__chart"><canvas class="chart" id="myChart" width="550" height="220"></canvas></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
