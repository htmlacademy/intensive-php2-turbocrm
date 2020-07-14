<?php
namespace frontend\widgets;

use yii\base\Widget;
use yii\helpers\Html;
use Yii;

class Notification extends Widget
{

    /**
     * @var string Текст уведомления
     */
    public $title;

    /**
     * @var string
     * Служебное название виджета. Если указано, то виджет будет показан только при существовании такого flash-сообщения
     */
    public $flashName;

    public function run()
    {
        $content = $this->renderBody();

        if (!$this->flashName || Yii::$app->session->hasFlash($this->flashName)) {
            return $content;
        }
    }

    private function renderCloseButton()
    {
        $icon = '<svg width="24" height="24"><use xlink:href="img/sprite.svg#x-circle"></use></svg>';
        $button = Html::button($icon, ['class' => 'alert__close button button--icon']);

        return $button;
    }

    private function renderBody()
    {
        $msg = Html::tag('p', $this->title, ['class' => 'alert__message']);
        $body = Html::tag('div', $this->renderCloseButton() . $msg, ['class' => 'alert']);

        return $body;
    }

}
