<?php

namespace frontend\modules\api\controllers;

use frontend\models\Contact;
use yii\rest\ActiveController;

/**
 * Default controller for the `api` module
 */
class ContactsController extends ActiveController
{
    public $modelClass = Contact::class;
}
