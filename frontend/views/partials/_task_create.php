<?php

?>

<div class="task-widget"><a class="button button--shadow task-widget__button js-create-task" href="#"><span>Новая задача</span></a>
    <div class="alert task-widget__container js-task-widget">
        <button class="alert__close button button--icon task-widget__close-button" type="button">
            <svg width="24" height="24">
                <use xlink:href="img/sprite.svg#x-circle"></use>
            </svg>
        </button>
        <div class="alert__content"><textarea class="textarea task-widget__textarea" rows="1"
                                              placeholder="Описание"></textarea>
            <form class="task-widget__form deal-form" method="POST">
                <div class="task-widget__type"><select class="select">
                        <option value="0" placeholder="placeholder">Тип задачи</option>
                        <option value="1">Разработка</option>
                        <option value="2">Маркетинг</option>
                        <option value="3">Дизайн</option>
                        <option value="4">Аналитика</option>
                        <option value="5">Копирайтинг</option>
                    </select></div>
                <div class="task-widget__executor"><select class="select">
                        <option value="0" placeholder="placeholder">Исполнитель</option>
                        <option value="1">Олег Иванов</option>
                        <option value="2">Анна Михайлова</option>
                        <option value="3">Алиса Федосеева</option>
                        <option value="4">Влад Климов</option>
                        <option value="5">Михайл Кочетков</option>
                        <option value="6">Юрий Пономарев</option>
                        <option value="7">Яна Светлова</option>
                    </select></div>
                <div class="task-widget__date-wrapper"><input
                        class="task-widget__input task-widget__input--date deal-form__field--date deal-form__field js-resizable"
                        type="text" readonly="readonly" placeholder="Срок"/>
                    <div class="task-widget__calendar-container"></div>
                </div>
                <button class="task-widget__button link" type="submit"><span>Добавить</span></button>
            </form>
        </div>
    </div>
</div>

