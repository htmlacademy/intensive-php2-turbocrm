<?php
/**
 * @var $this View
 * @var $contacts array
 */

use yii\web\View;

$this->title = 'Список контактов';
?>
<section class="contacts-section">
    <div class="contacts-section__header">
        <h1 class="contacts-section__headline">Контакты</h1><a
                class="button button--tiny button--gray contacts-section__btn js-filters-toggler"
                href="#">Фильтровать</a><a class="button button--tiny contacts-section__btn modal-open" href="#">Добавить</a>
        <div class="contacts-section__search">
            <div class="search-block">
                <form class="search-block__form" action="#" method="post">
                    <div class="search-block__field-wrapper"><label class="search-block__label"
                                                                    for="trade-search-field"><span
                                    class="visually-hidden">Поле поиска</span>
                            <svg width="16" height="16">
                                <use xlink:href="/img/sprite.svg#zoom"></use>
                            </svg>
                        </label><input class="search-block__field" id="trade-search-field" type="search"
                                       placeholder="Поиск">
                        <button class="visually-hidden" type="submit">Найти</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="contacts-section__pagination-block-wrapper"><a
                    class="button button--tiny button--green contacts-section__btn" href="#">Экспорт XLS</a>
            <div class="contacts-section__pagination-block">
                <div class="pagination-block">
                    <a class="pagination-block__btn pagination-block__btn--prev pagination-block__btn--disabled" href="#">
                        <svg width="7" height="12"><use xlink:href="/img/sprite.svg#next"></use></svg>
                    </a>
                    <div class="pagination-block__pages">
                        <span class="pagination-block__current">1</span>
                        <span>&nbsp;/&nbsp;</span>
                        <span class="pagination-block__total">12</span>
                    </div>
                    <a class="pagination-block__btn pagination-block__btn--next" href="#">
                        <svg width="7" height="12"><use xlink:href="/img/sprite.svg#next"></use></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="contacts-section__filters js-filters">
        <div class="filters-block">
            <form class="filters-block__form" action="#" method="post">
                <div class="filters-block__field field field--select field--small"><label class="field__label"
                                                                                          for="status-selection">Cтатус</label><select
                            class="field__select select" id="status-selection">
                        <option value="0" placeholder>Новый</option>
                        <option value="1">Не новый</option>
                    </select></div>
                <div class="filters-block__field field field--select"><select class="field__select select">
                        <option value="0" placeholder>Компания</option>
                        <option value="1">Не компания</option>
                    </select></div>
                <button class="filters-block__btn button button--normal" type="submit">Применить</button>
            </form>
            <button class="filters-block__close button button--icon js-filters-toggler" type="button">
                <svg width="24" height="24">
                    <use xlink:href="/img/sprite.svg#x-circle"></use>
                </svg>
            </button>
        </div>
    </div>
    <div class="contacts-section__content">
        <table class="data-table">
            <tr>
                <th>
                    <div class="field field--checkbox"><input class="field__input visually-hidden js-check-all"
                                                              type="checkbox" id="check-all"><label class="field__label"
                                                                                                    for="check-all"></label>
                    </div>
                </th>
                <th>
                    <p>Контакт</p>
                </th>
                <th>
                    <p>Компания</p>
                </th>
                <th>
                    <p>Должность</p>
                </th>
                <th>
                    <p>Тип
                        <button class="data-table__sort-btn" type="button"><span class="visually-hidden">Сортировать колонку</span><span>↓</span>
                        </button>
                    </p>
                </th>
                <th>
                    <p>Телефон</p>
                </th>
                <th>
                    <p>Email</p>
                </th>
                <th></th>
            </tr>
            <?php foreach ($contacts as $contact): ?>
                <tr>
                    <td>
                        <div class="field field--checkbox"><input class="field__input visually-hidden js-row-selection"
                                                                  type="checkbox" id="row0"><label class="field__label"
                                                                                                   for="row0"></label>
                        </div>
                    </td>
                    <td>
                        <p><?= $contact->name; ?></p>
                    </td>
                    <td>
                        <p><?= $contact->company->name; ?></p>
                    </td>
                    <td>
                        <p><?= $contact->position; ?></p>
                    </td>
                    <td>
                        <p><?= $contact->status->name; ?></p>
                    </td>
                    <td><a class="data-table__link" href="tel:+77892131212">
                            <svg width="8" height="14">
                                <use xlink:href="/img/sprite.svg#mobile"></use>
                            </svg>
                            <span><?= $contact->phone; ?></span></a></td>
                    <td><a class="data-table__link"
                           href="mailto:<?= $contact->email; ?>"><span><?= $contact->email; ?></span></a>
                        <p></p>
                    </td>
                    <td>
                        <div class="data-table__edit-block">
                            <div class="data-table__buttons">
                                <button class="data-table__btn button button--tiny button--red" type="button">Удалить
                                </button>
                                <button class="data-table__btn button button--tiny button--gray" type="button">
                                    Дублировать
                                </button>
                                <button class="data-table__btn button button--tiny button--gray" type="button">
                                    Редактировать
                                </button>
                                <button class="data-table__close-edition button button--icon js-toggle-edition"
                                        type="button">
                                    <svg width="24" height="24">
                                        <use xlink:href="/img/sprite.svg#x-circle"></use>
                                    </svg>
                                </button>
                            </div>
                            <button class="data-table__edit js-toggle-edition" type="button">
                                <svg width="16" height="17">
                                    <use xlink:href="/img/sprite.svg#edit"></use>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            <?php endforeach; ?>
        </table>
    </div>
    <div class="contacts-section__footer">
        <ul class="data-summary">
            <li>648 контакта</li>
            <li>312 активных</li>
            <li>15 новых</li>
        </ul>
    </div>
    <?= $this->render('//modals/_contact_form'); ?>
</section>
