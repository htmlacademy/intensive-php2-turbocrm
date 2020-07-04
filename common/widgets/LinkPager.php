<?php


namespace common\widgets;


use yii\helpers\ArrayHelper;
use yii\helpers\Html;

class LinkPager extends \yii\widgets\LinkPager
{
    protected function renderPageButtons()
    {
        $pageCount = $this->pagination->getPageCount();
        if ($pageCount < 2 && $this->hideOnSinglePage) {
            return '';
        }

        $buttons = [];
        $currentPage = $this->pagination->getPage();


        // prev page
        if ($this->prevPageLabel !== false) {
            if (($page = $currentPage - 1) < 0) {
                $page = 0;
            }
            $buttons[] = $this->renderPageButton($this->prevPageLabel, $page, $this->prevPageCssClass, $currentPage <= 0, false);
        }

        $internal = Html::tag('div',
            Html::tag('span', $currentPage + 1, ['class' => 'pagination-block__current']) .
            Html::tag('span', ' / ') .
            Html::tag('span', $this->pagination->getPageCount(), ['class' => 'pagination-block__total'])
        , ['class' => 'pagination-block__pages']);

        $buttons[] = $internal;

        // next page
        if ($this->nextPageLabel !== false) {
            if (($page = $currentPage + 1) >= $pageCount - 1) {
                $page = $pageCount - 1;
            }
            $buttons[] = $this->renderPageButton($this->nextPageLabel, $page, $this->nextPageCssClass, $currentPage >= $pageCount - 1, false);
        }

        $options = $this->options;
        $tag = ArrayHelper::remove($options, 'tag', 'ul');
        return Html::tag($tag, implode("\n", $buttons), $options);
    }

}
