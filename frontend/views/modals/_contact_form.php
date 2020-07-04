<div class="modal">
    <div class="modal__container"><button class="button button--tiny button--gray modal__close" type="button"><span>&lt; Отмена</span></button>
        <form class="create-contact" metod="POST">
            <p class="create-contact__title header-3">Новый контакт</p>
            <div class="field create-contact__field"><label class="field__label">Имя</label><input class="field__input input" type="text"></div>
            <div class="field field--error field--select create-contact__field"><label class="field__label">Компания</label><select class="field__select select">
                    <option value="" placeholder>Выбрать</option>
                    <option value="1">Агромеда</option>
                    <option value="2">Анло</option>
                    <option value="3">Большая книга</option>
                    <option value="4">Греческий феномен</option>
                    <option value="5">Домино</option>
                </select></div>
            <div class="field create-contact__field"><label class="field__label">Должность</label><input class="field__input input" type="text"></div>
            <div class="field field--select create-contact__field create-contact__field--small"><label class="field__label">Статус</label><select class="field__select select">
                    <option value="" placeholder>Выбрать</option>
                    <option value="1">Новый</option>
                </select></div>
            <div class="field field--error create-contact__field"><label class="field__label">Телефон</label><input class="field__input input" type="text"></div>
            <div class="field field--error create-contact__field"><label class="field__label">Электронная почта</label><input class="field__input input" type="text"><span class="field__error-message">Похоже вы ошиблись в этом поле</span></div>
            <div class="create-contact__bottom-block create-contact__bottom-block--error"><button class="button button--normal create-contact__button" type="submit"><span>Добавить</span></button><span class="create-contact__description">Обязательные поля</span></div>
        </form>
    </div>
</div>
