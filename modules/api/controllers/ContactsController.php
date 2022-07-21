<?php

namespace app\modules\api\controllers;

use app\models\Contact;
use yii\rest\ActiveController;

/**
 * Default controller for the `api` module
 */
class ContactsController extends ActiveController
{
    public $modelClass = Contact::class;
}
